import { Context, Next } from 'hono';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error('Error occurred:', error);
    
    if (error instanceof Error) {
      return c.json({
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }, 500);
    }
    
    return c.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}
