import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../db/database.js';
import { generateToken } from '../middleware/auth.js';
import { LoginRequest, User, ApiResponse, LoginResponse } from '../types/index.js';

const auth = new Hono();

// Login
auth.post('/login', async (c) => {
  const db = getDatabase();
  const body = await c.req.json() as LoginRequest;
  
  if (!body.email || !body.password) {
    return c.json({
      success: false,
      error: 'Email and password are required'
    } as ApiResponse, 400);
  }

  try {
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [body.email]
    ) as User;

    if (!user) {
      return c.json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse, 401);
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash!);
    
    if (!isPasswordValid) {
      return c.json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse, 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { password_hash, ...userResponse } = user;

    return c.json({
      success: true,
      data: {
        user: userResponse,
        token,
        expires_in: 24 * 60 * 60 // 24 hours in seconds
      }
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      error: 'Login failed'
    } as ApiResponse, 500);
  }
});

// Register
auth.post('/register', async (c) => {
  const db = getDatabase();
  const body = await c.req.json();
  
  if (!body.email || !body.password || !body.name) {
    return c.json({
      success: false,
      error: 'Email, password, and name are required'
    } as ApiResponse, 400);
  }

  try {
    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [body.email]
    );

    if (existingUser) {
      return c.json({
        success: false,
        error: 'User already exists'
      } as ApiResponse, 409);
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const userId = crypto.randomUUID();

    await db.run(
      `INSERT INTO users (id, email, name, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, body.email, body.name, passwordHash, 'user']
    );

    const token = generateToken({
      userId,
      email: body.email,
      role: 'user'
    });

    return c.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: body.email,
          name: body.name,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        token,
        expires_in: 24 * 60 * 60
      }
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      success: false,
      error: 'Registration failed'
    } as ApiResponse, 500);
  }
});

export default auth;
