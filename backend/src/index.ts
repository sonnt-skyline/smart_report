import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { migrate } from './db/migrate.js';
import { seed } from './db/seed.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import actionsRoutes from './routes/actions.js';
import reportsRoutes from './routes/reports.js';
import categoriesRoutes from './routes/categories.js';

const app = new Hono();

// Global middleware
app.use('*', corsMiddleware);
app.use('*', errorHandler);

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Smart Report API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      actions: '/api/actions',
      reports: '/api/reports',
      categories: '/api/categories'
    }
  });
});

app.get('/health', (c) => {
  return c.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/actions', actionsRoutes);
app.route('/api/reports', reportsRoutes);
app.route('/api/categories', categoriesRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Endpoint not found'
  }, 404);
});

// Initialize database and start server
async function startServer() {
  const port = parseInt(process.env.PORT || '3001');
  
  try {
    console.log('Initializing database...');
    await migrate();
    
    // Seed database if needed (only in development)
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seed();
      } catch (error) {
        console.log('Database already seeded or seeding failed:', (error as Error).message);
      }
    }
    
    console.log(`Starting server on port ${port}...`);
    
    serve({
      fetch: app.fetch,
      port: port,
    });
    
    console.log(`🚀 Smart Report API is running on http://localhost:${port}`);
    console.log(`📖 API Documentation available at http://localhost:${port}`);
    console.log(`💚 Health check: http://localhost:${port}/health`);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Graceful shutdown...');
  process.exit(0);
});

// Start the server
startServer();
