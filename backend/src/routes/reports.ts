import { Hono } from 'hono';
import { getDatabase } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { getCurrentWeek, getPreviousWeek, getNextWeek } from '../utils/week.js';
import {
  WeeklyReport,
  SubmitWeeklyReportRequest,
  AuthTokenPayload,
  ApiResponse
} from '../types/index.js';

type Variables = {
  user: AuthTokenPayload;
};

const reports = new Hono<{ Variables: Variables }>();

// Apply auth middleware to all routes
reports.use('*', authMiddleware);

// // Get all reports (defaults to weekly reports)
// reports.get('/', async (c) => {
//   // Redirect to weekly reports endpoint
//   const query = c.req.query();
//   const queryString = new URLSearchParams(query).toString();
//   const url = `/api/reports/weekly${queryString ? '?' + queryString : ''}`;
  
//   // Forward the request to weekly endpoint
//   const db = getDatabase();
//   const user = c.get('user') as AuthTokenPayload;
//   const week = c.req.query('week');
//   const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50);
//   const offset = (parseInt(c.req.query('page') || '1') - 1) * limit;

//   try {
//     let sql = `
//       SELECT wr.*, u.name as member_name, u.email as member_email
//       FROM weekly_reports wr
//       LEFT JOIN users u ON wr.member_id = u.id
//       WHERE wr.member_id = ?
//     `;
//     const params: any[] = [user.userId];

//     if (week) {
//       sql += ' AND wr.week = ?';
//       params.push(week);
//     }

//     sql += ' ORDER BY wr.week DESC LIMIT ? OFFSET ?';
//     params.push(limit, offset);

//     const reportsResult = await db.all(sql, params);

//     // Get actions for each report
//     const reportsWithActions = await Promise.all(
//       reportsResult.map(async (report) => {
//         // Get actions that were updated during this week
//         const actions = await db.all(`
//           SELECT a.*, su.progress, su.work_status
//           FROM actions a
//           JOIN status_updates su ON a.id = su.action_id
//           WHERE a.member_id = ? AND su.week = ?
//         `, [user.userId, report.week]);

//         return {
//           ...report,
//           member: {
//             id: report.member_id,
//             name: report.member_name,
//             email: report.member_email
//           },
//           actions
//         };
//       })
//     );

//     return c.json({
//       success: true,
//       data: reportsWithActions
//     } as ApiResponse<WeeklyReport[]>);

//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     return c.json({
//       success: false,
//       error: 'Failed to fetch reports'
//     } as ApiResponse, 500);
//   }
// });

// Get weekly reports for current user
reports.get('/weekly', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const week = c.req.query('week');
  const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50);
  const offset = (parseInt(c.req.query('page') || '1') - 1) * limit;

  try {
    let sql = `
      SELECT wr.*, u.name as member_name, u.email as member_email
      FROM weekly_reports wr
      LEFT JOIN users u ON wr.member_id = u.id
      WHERE wr.member_id = ?
    `;
    const params: any[] = [user.userId];

    if (week) {
      sql += ' AND wr.week = ?';
      params.push(week);
    }

    sql += ' ORDER BY wr.week DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const reportsResult = await db.all(sql, params);

    // Get actions for each report
    const reportsWithActions = await Promise.all(
      reportsResult.map(async (report) => {
        // Get actions that were updated during this week
        const actions = await db.all(`
          SELECT a.*, su.progress, su.work_status
          FROM actions a
          JOIN status_updates su ON a.id = su.action_id
          WHERE a.member_id = ? AND su.week = ?
        `, [user.userId, report.week]);

        return {
          ...report,
          member: {
            id: report.member_id,
            name: report.member_name,
            email: report.member_email
          },
          actions
        };
      })
    );

    return c.json({
      success: true,
      data: reportsWithActions
    } as ApiResponse<WeeklyReport[]>);

  } catch (error) {
    console.error('Error fetching weekly reports:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch weekly reports'
    } as ApiResponse, 500);
  }
});

// Get specific weekly report
reports.get('/weekly/:week', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const week = c.req.param('week');

  try {
    const report = await db.get(`
      SELECT wr.*, u.name as member_name, u.email as member_email
      FROM weekly_reports wr
      LEFT JOIN users u ON wr.member_id = u.id
      WHERE wr.member_id = ? AND wr.week = ?
    `, [user.userId, week]);

    if (!report) {
      return c.json({
        success: false,
        error: 'Weekly report not found'
      } as ApiResponse, 404);
    }

    // Get actions for this week
    const actions = await db.all(`
      SELECT a.*, su.progress, su.work_status
      FROM actions a
      JOIN status_updates su ON a.id = su.action_id
      WHERE a.member_id = ? AND su.week = ?
    `, [user.userId, week]);

    const reportWithActions = {
      ...report,
      member: {
        id: report.member_id,
        name: report.member_name,
        email: report.member_email
      },
      actions
    };

    // Add navigation metadata
    const currentWeek = getCurrentWeek();
    const previousWeek = getPreviousWeek(week);
    const nextWeek = getNextWeek(week);
    
    // Check if previous/next reports exist
    const [previousReport, nextReport] = await Promise.all([
      db.get('SELECT week FROM weekly_reports WHERE member_id = ? AND week = ?', [user.userId, previousWeek]),
      db.get('SELECT week FROM weekly_reports WHERE member_id = ? AND week = ?', [user.userId, nextWeek])
    ]);

    return c.json({
      success: true,
      data: reportWithActions,
      navigation: {
        current_week: currentWeek,
        previous_week: previousWeek,
        next_week: nextWeek,
        has_previous: !!previousReport,
        has_next: !!nextReport && nextWeek <= currentWeek, // Don't navigate to future weeks
        links: {
          previous: previousReport ? `/api/reports/weekly/${previousWeek}` : null,
          next: (nextReport && nextWeek <= currentWeek) ? `/api/reports/weekly/${nextWeek}` : null,
          current: `/api/reports/weekly/${currentWeek}`
        }
      }
    } as ApiResponse<WeeklyReport>);

  } catch (error) {
    console.error('Error fetching weekly report:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch weekly report'
    } as ApiResponse, 500);
  }
});

// Submit weekly report
reports.post('/weekly', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const body = await c.req.json() as SubmitWeeklyReportRequest;

  if (!body.week) {
    return c.json({
      success: false,
      error: 'Week is required'
    } as ApiResponse, 400);
  }

  try {
    const reportId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.transaction(async (db) => {
      // Insert or update weekly report
      await db.run(`
        INSERT OR REPLACE INTO weekly_reports 
        (id, member_id, week, progress_notes, blockers_notes, next_steps_notes, additional_notes, submitted_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        reportId, user.userId, body.week, 
        body.progress_notes, body.blockers_notes, body.next_steps_notes, body.additional_notes,
        now, now, now
      ]);

      // Update action status for each action in the report
      if (body.actions && body.actions.length > 0) {
        for (const actionUpdate of body.actions) {
          const statusId = crypto.randomUUID();
          
          // Insert or update status update
          await db.run(`
            INSERT OR REPLACE INTO status_updates 
            (id, action_id, week, progress, work_status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            statusId, actionUpdate.action_id, body.week, 
            actionUpdate.progress, actionUpdate.work_status, now, now
          ]);
        }
      }
    });

    // Return the created report
    const createdReport = await db.get(`
      SELECT wr.*, u.name as member_name, u.email as member_email
      FROM weekly_reports wr
      LEFT JOIN users u ON wr.member_id = u.id
      WHERE wr.id = ?
    `, [reportId]);

    // Get updated actions
    const actions = await db.all(`
      SELECT a.*, su.progress, su.work_status
      FROM actions a
      JOIN status_updates su ON a.id = su.action_id
      WHERE a.member_id = ? AND su.week = ?
    `, [user.userId, body.week]);

    return c.json({
      success: true,
      data: {
        ...createdReport,
        member: {
          id: user.userId,
          name: createdReport.member_name,
          email: createdReport.member_email
        },
        actions
      },
      message: 'Weekly report submitted successfully'
    } as ApiResponse<WeeklyReport>, 201);

  } catch (error) {
    console.error('Error submitting weekly report:', error);
    return c.json({
      success: false,
      error: 'Failed to submit weekly report'
    } as ApiResponse, 500);
  }
});

// Update weekly report
reports.put('/weekly/:week', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const week = c.req.param('week');
  const body = await c.req.json();

  try {
    // Check if report exists
    const existingReport = await db.get(
      'SELECT id FROM weekly_reports WHERE member_id = ? AND week = ?',
      [user.userId, week]
    );

    if (!existingReport) {
      return c.json({
        success: false,
        error: 'Weekly report not found'
      } as ApiResponse, 404);
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const params: any[] = [];

    // Build dynamic update query
    const allowedFields = ['progress_notes', 'blockers_notes', 'next_steps_notes', 'additional_notes'];
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updates.length > 0) {
      updates.push('updated_at = ?');
      params.push(now);
      params.push(user.userId, week);

      await db.run(
        `UPDATE weekly_reports SET ${updates.join(', ')} WHERE member_id = ? AND week = ?`,
        params
      );
    }

    // Get updated report
    const updatedReport = await db.get(`
      SELECT wr.*, u.name as member_name, u.email as member_email
      FROM weekly_reports wr
      LEFT JOIN users u ON wr.member_id = u.id
      WHERE wr.member_id = ? AND wr.week = ?
    `, [user.userId, week]);

    return c.json({
      success: true,
      data: updatedReport,
      message: 'Weekly report updated successfully'
    } as ApiResponse<WeeklyReport>);

  } catch (error) {
    console.error('Error updating weekly report:', error);
    return c.json({
      success: false,
      error: 'Failed to update weekly report'
    } as ApiResponse, 500);
  }
});

// Delete weekly report
reports.delete('/weekly/:week', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const week = c.req.param('week');

  try {
    const result = await db.run(
      'DELETE FROM weekly_reports WHERE member_id = ? AND week = ?',
      [user.userId, week]
    );

    if (result.changes === 0) {
      return c.json({
        success: false,
        error: 'Weekly report not found'
      } as ApiResponse, 404);
    }

    return c.json({
      success: true,
      message: 'Weekly report deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error deleting weekly report:', error);
    return c.json({
      success: false,
      error: 'Failed to delete weekly report'
    } as ApiResponse, 500);
  }
});

// Get week navigation data
reports.get('/weekly/:week/navigation', async (c) => {
  const db = getDatabase();
  const user = c.get('user') as AuthTokenPayload;
  const week = c.req.param('week');

  try {
    const currentWeek = getCurrentWeek();
    const previousWeek = getPreviousWeek(week);
    const nextWeek = getNextWeek(week);
    
    // Get available weeks for this user
    const availableWeeks = await db.all(
      'SELECT week FROM weekly_reports WHERE member_id = ? ORDER BY week DESC',
      [user.userId]
    );
    
    // Check if previous/next reports exist
    const [previousReport, nextReport] = await Promise.all([
      db.get('SELECT week FROM weekly_reports WHERE member_id = ? AND week = ?', [user.userId, previousWeek]),
      db.get('SELECT week FROM weekly_reports WHERE member_id = ? AND week = ?', [user.userId, nextWeek])
    ]);

    return c.json({
      success: true,
      data: {
        current_week: currentWeek,
        requested_week: week,
        previous_week: previousWeek,
        next_week: nextWeek,
        has_previous: !!previousReport,
        has_next: !!nextReport && nextWeek <= currentWeek,
        available_weeks: availableWeeks.map(w => w.week),
        links: {
          previous: previousReport ? `/api/reports/weekly/${previousWeek}` : null,
          next: (nextReport && nextWeek <= currentWeek) ? `/api/reports/weekly/${nextWeek}` : null,
          current: `/api/reports/weekly/${currentWeek}`,
          list: '/api/reports/weekly'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching week navigation:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch week navigation'
    } as ApiResponse, 500);
  }
});

export default reports;
