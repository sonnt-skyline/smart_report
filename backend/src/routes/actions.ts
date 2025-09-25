import { Hono } from 'hono';
import { getDatabase } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { 
  Action, 
  CreateActionRequest, 
  UpdateActionRequest, 
  CreateStatusUpdateRequest,
  AuthTokenPayload,
  ApiResponse,
  ActionQueryParams
} from '../types/index.js';

type Variables = {
  user: AuthTokenPayload;
};

const actions = new Hono<{ Variables: Variables }>();

// Apply auth middleware to all routes
actions.use('*', authMiddleware);

// Get all actions for current user with optional filters
actions.get('/', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const query = c.req.query() as ActionQueryParams;
  
  try {
    let sql = `
      SELECT a.*, u.name as member_name, u.email as member_email
      FROM actions a
      LEFT JOIN users u ON a.member_id = u.id
      WHERE a.member_id = ?
    `;
    const params: any[] = [user.userId];

    // Add filters
    if (query.category) {
      sql += ' AND a.category = ?';
      params.push(query.category);
    }
    
    if (query.sub_category) {
      sql += ' AND a.sub_category = ?';
      params.push(query.sub_category);
    }

    // Add sorting
    const sortField = query.sort || 'created_at';
    const sortOrder = query.order || 'desc';
    sql += ` ORDER BY a.${sortField} ${sortOrder.toUpperCase()}`;

    // Add pagination
    const limit = Math.min(parseInt(String(query.limit || '50')), 100);
    const offset = (parseInt(String(query.page || '1')) - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const actionsResult = await db.all(sql, params);

    // Get status updates for each action
    const actionsWithUpdates = await Promise.all(
      actionsResult.map(async (action) => {
        const statusUpdates = await db.all(
          'SELECT * FROM status_updates WHERE action_id = ? ORDER BY week DESC',
          [action.id]
        );
        
        const tags = await db.all(
          'SELECT tag FROM action_tags WHERE action_id = ?',
          [action.id]
        );

        return {
          ...action,
          status_updates: statusUpdates,
          tags: tags.map((t: any) => t.tag),
          member: {
            id: action.member_id,
            name: action.member_name,
            email: action.member_email
          }
        };
      })
    );

    return c.json({
      success: true,
      data: actionsWithUpdates
    } as ApiResponse<Action[]>);

  } catch (error) {
    console.error('Error fetching actions:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch actions'
    } as ApiResponse, 500);
  }
});

// Get single action by ID
actions.get('/:id', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const actionId = c.req.param('id');

  try {
    const action = await db.get(
      `SELECT a.*, u.name as member_name, u.email as member_email
       FROM actions a
       LEFT JOIN users u ON a.member_id = u.id
       WHERE a.id = ? AND a.member_id = ?`,
      [actionId, user.userId]
    );

    if (!action) {
      return c.json({
        success: false,
        error: 'Action not found'
      } as ApiResponse, 404);
    }

    // Get status updates
    const statusUpdates = await db.all(
      'SELECT * FROM status_updates WHERE action_id = ? ORDER BY week DESC',
      [actionId]
    );
    
    // Get tags
    const tags = await db.all(
      'SELECT tag FROM action_tags WHERE action_id = ?',
      [actionId]
    );

    const actionWithDetails = {
      ...action,
      status_updates: statusUpdates,
      tags: tags.map((t: any) => t.tag),
      member: {
        id: action.member_id,
        name: action.member_name,
        email: action.member_email
      }
    };

    return c.json({
      success: true,
      data: actionWithDetails
    } as ApiResponse<Action>);

  } catch (error) {
    console.error('Error fetching action:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch action'
    } as ApiResponse, 500);
  }
});

// Create new action
actions.post('/', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const body = await c.req.json() as CreateActionRequest;

  if (!body.title || !body.category || !body.sub_category) {
    return c.json({
      success: false,
      error: 'Title, category, and sub_category are required'
    } as ApiResponse, 400);
  }

  try {
    const actionId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.transaction(async (db) => {
      // Insert action
      await db.run(
        `INSERT INTO actions 
         (id, title, category, sub_category, target, definition_of_done, deadline, member_id, parent_objective, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          actionId, body.title, body.category, body.sub_category,
          body.target, body.definition_of_done, body.deadline,
          user.userId, body.parent_objective, now, now
        ]
      );

      // Insert tags if provided
      if (body.tags && body.tags.length > 0) {
        for (const tag of body.tags) {
          await db.run(
            'INSERT INTO action_tags (action_id, tag) VALUES (?, ?)',
            [actionId, tag]
          );
        }
      }
    });

    // Return the created action
    const createdAction = await db.get(
      `SELECT a.*, u.name as member_name, u.email as member_email
       FROM actions a
       LEFT JOIN users u ON a.member_id = u.id
       WHERE a.id = ?`,
      [actionId]
    );

    return c.json({
      success: true,
      data: {
        ...createdAction,
        status_updates: [],
        tags: body.tags || [],
        member: {
          id: user.userId,
          name: createdAction.member_name,
          email: createdAction.member_email
        }
      }
    } as ApiResponse<Action>, 201);

  } catch (error) {
    console.error('Error creating action:', error);
    return c.json({
      success: false,
      error: 'Failed to create action'
    } as ApiResponse, 500);
  }
});

// Update action
actions.put('/:id', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const actionId = c.req.param('id');
  const body = await c.req.json() as UpdateActionRequest;

  try {
    // Check if action exists and belongs to user
    const existingAction = await db.get(
      'SELECT id FROM actions WHERE id = ? AND member_id = ?',
      [actionId, user.userId]
    );

    if (!existingAction) {
      return c.json({
        success: false,
        error: 'Action not found'
      } as ApiResponse, 404);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const params: any[] = [];

    // Build dynamic update query
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && key !== 'tags') {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updates.length > 0) {
      updates.push('updated_at = ?');
      params.push(now);
      params.push(actionId);

      await db.run(
        `UPDATE actions SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    // Get updated action
    const updatedAction = await db.get(
      `SELECT a.*, u.name as member_name, u.email as member_email
       FROM actions a
       LEFT JOIN users u ON a.member_id = u.id
       WHERE a.id = ?`,
      [actionId]
    );

    return c.json({
      success: true,
      data: updatedAction
    } as ApiResponse<Action>);

  } catch (error) {
    console.error('Error updating action:', error);
    return c.json({
      success: false,
      error: 'Failed to update action'
    } as ApiResponse, 500);
  }
});

// Delete action
actions.delete('/:id', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const actionId = c.req.param('id');

  try {
    const result = await db.run(
      'DELETE FROM actions WHERE id = ? AND member_id = ?',
      [actionId, user.userId]
    );

    if (result.changes === 0) {
      return c.json({
        success: false,
        error: 'Action not found'
      } as ApiResponse, 404);
    }

    return c.json({
      success: true,
      message: 'Action deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error deleting action:', error);
    return c.json({
      success: false,
      error: 'Failed to delete action'
    } as ApiResponse, 500);
  }
});

// Update action status
actions.post('/:id/status', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const actionId = c.req.param('id');
  const body = await c.req.json() as CreateStatusUpdateRequest;

  if (!body.week || body.progress === undefined || !body.work_status) {
    return c.json({
      success: false,
      error: 'Week, progress, and work_status are required'
    } as ApiResponse, 400);
  }

  try {
    // Check if action exists and belongs to user
    const action = await db.get(
      'SELECT id FROM actions WHERE id = ? AND member_id = ?',
      [actionId, user.userId]
    );

    if (!action) {
      return c.json({
        success: false,
        error: 'Action not found'
      } as ApiResponse, 404);
    }

    const statusId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert or update status update
    await db.run(
      `INSERT OR REPLACE INTO status_updates 
       (id, action_id, week, progress, work_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [statusId, actionId, body.week, body.progress, body.work_status, now, now]
    );

    const statusUpdate = await db.get(
      'SELECT * FROM status_updates WHERE action_id = ? AND week = ?',
      [actionId, body.week]
    );

    return c.json({
      success: true,
      data: statusUpdate
    } as ApiResponse, 201);

  } catch (error) {
    console.error('Error updating action status:', error);
    return c.json({
      success: false,
      error: 'Failed to update action status'
    } as ApiResponse, 500);
  }
});

export default actions;
