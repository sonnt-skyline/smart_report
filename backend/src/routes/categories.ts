import { Hono } from 'hono';
import { getDatabase } from '../db/database.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';
import { Category, Subcategory, ApiResponse } from '../types/index.js';

const categories = new Hono();

// Apply optional auth middleware (these routes can be accessed without authentication)
categories.use('*', optionalAuthMiddleware);

// Get all categories
categories.get('/', async (c) => {
  const db = getDatabase();

  try {
    const categoriesResult = await db.all(
      'SELECT * FROM categories ORDER BY name'
    );

    return c.json({
      success: true,
      data: categoriesResult
    } as ApiResponse<Category[]>);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch categories'
    } as ApiResponse, 500);
  }
});

// Get category by ID with subcategories
categories.get('/:id', async (c) => {
  const db = getDatabase();
  const categoryId = c.req.param('id');

  try {
    const category = await db.get(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found'
      } as ApiResponse, 404);
    }

    const subcategories = await db.all(
      'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name',
      [categoryId]
    );

    return c.json({
      success: true,
      data: {
        ...category,
        subcategories
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch category'
    } as ApiResponse, 500);
  }
});

// Get all subcategories
categories.get('/:id/subcategories', async (c) => {
  const db = getDatabase();
  const categoryId = c.req.param('id');

  try {
    const subcategories = await db.all(
      `SELECT s.*, c.name as category_name 
       FROM subcategories s
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.category_id = ?
       ORDER BY s.name`,
      [categoryId]
    );

    return c.json({
      success: true,
      data: subcategories
    } as ApiResponse<Subcategory[]>);

  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch subcategories'
    } as ApiResponse, 500);
  }
});

// Get all categories with their subcategories
categories.get('/with-subcategories', async (c) => {
  const db = getDatabase();

  try {
    const categoriesWithSubs = await db.all(`
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.description as category_description,
        s.id as subcategory_id,
        s.name as subcategory_name,
        s.description as subcategory_description
      FROM categories c
      LEFT JOIN subcategories s ON c.id = s.category_id
      ORDER BY c.name, s.name
    `);

    // Group subcategories under their categories
    const categoriesMap = new Map();
    
    categoriesWithSubs.forEach(row => {
      if (!categoriesMap.has(row.category_id)) {
        categoriesMap.set(row.category_id, {
          id: row.category_id,
          name: row.category_name,
          description: row.category_description,
          subcategories: []
        });
      }
      
      if (row.subcategory_id) {
        categoriesMap.get(row.category_id).subcategories.push({
          id: row.subcategory_id,
          category_id: row.category_id,
          name: row.subcategory_name,
          description: row.subcategory_description
        });
      }
    });

    const result = Array.from(categoriesMap.values());

    return c.json({
      success: true,
      data: result
    } as ApiResponse);

  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch categories with subcategories'
    } as ApiResponse, 500);
  }
});

export default categories;
