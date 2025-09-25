# Smart Report Backend API

A robust backend API for the Smart Report application built with Hono and SQLite.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **Actions Management**: CRUD operations for action items with status tracking
- **Weekly Reports**: Submit and manage weekly progress reports
- **Categories**: Hierarchical categorization system for actions
- **Status Updates**: Track progress and status changes over time
- **Database**: SQLite with proper schema and relationships

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database**: SQLite with sqlite3 driver
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Language**: TypeScript
- **Runtime**: Node.js

## Project Structure

```
src/
├── db/
│   ├── database.ts      # Database connection and utilities
│   ├── migrate.ts       # Database schema migrations
│   └── seed.ts          # Database seeding with sample data
├── middleware/
│   ├── auth.ts          # Authentication middleware
│   ├── cors.ts          # CORS middleware
│   └── errorHandler.ts  # Global error handling
├── routes/
│   ├── auth.ts          # Authentication endpoints
│   ├── actions.ts       # Actions CRUD endpoints
│   ├── reports.ts       # Weekly reports endpoints
│   └── categories.ts    # Categories and subcategories
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   └── week.ts          # Week calculation utilities
└── index.ts             # Application entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npm run db:migrate
```

3. Seed the database with sample data:
```bash
npm run db:seed
```

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Actions

- `GET /api/actions` - Get user's actions
- `GET /api/actions/:id` - Get specific action
- `POST /api/actions` - Create new action
- `PUT /api/actions/:id` - Update action
- `DELETE /api/actions/:id` - Delete action
- `POST /api/actions/:id/status` - Update action status

### Weekly Reports

- `GET /api/reports/weekly` - Get weekly reports
- `GET /api/reports/weekly/:week` - Get specific week report
- `POST /api/reports/weekly` - Submit weekly report
- `PUT /api/reports/weekly/:week` - Update weekly report
- `DELETE /api/reports/weekly/:week` - Delete weekly report

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with subcategories
- `GET /api/categories/:id/subcategories` - Get subcategories
- `GET /api/categories/with-subcategories` - Get all categories with their subcategories

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Default Users

After seeding, these users are available:

- **Admin**: admin@smartreport.com / admin123
- **User**: alice@smartreport.com / user123

## Database Schema

### Users
- `id`, `email`, `name`, `password_hash`, `role`, `created_at`, `updated_at`

### Actions
- `id`, `title`, `category`, `sub_category`, `target`, `definition_of_done`, `deadline`, `member_id`, `parent_objective`, `created_at`, `updated_at`

### Status Updates
- `id`, `action_id`, `week`, `progress`, `work_status`, `created_at`, `updated_at`

### Weekly Reports
- `id`, `member_id`, `week`, `progress_notes`, `blockers_notes`, `next_steps_notes`, `additional_notes`, `submitted_at`, `created_at`, `updated_at`

### Categories & Subcategories
- Categories: `id`, `name`, `description`
- Subcategories: `id`, `category_id`, `name`, `description`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret

## Building for Production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
