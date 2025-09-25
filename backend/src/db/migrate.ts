import { getDatabase } from './database.js';

const migrations = [
  // Users table
  `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // Actions table
  `
  CREATE TABLE IF NOT EXISTS actions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    target TEXT,
    definition_of_done TEXT,
    deadline TEXT,
    member_id TEXT NOT NULL,
    parent_objective TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `,

  // Status updates table
  `
  CREATE TABLE IF NOT EXISTS status_updates (
    id TEXT PRIMARY KEY,
    action_id TEXT NOT NULL,
    week TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    work_status TEXT DEFAULT 'Not started',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE,
    UNIQUE(action_id, week)
  );
  `,

  // Weekly reports table
  `
  CREATE TABLE IF NOT EXISTS weekly_reports (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    week TEXT NOT NULL,
    progress_notes TEXT,
    blockers_notes TEXT,
    next_steps_notes TEXT,
    additional_notes TEXT,
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(member_id, week)
  );
  `,

  // Action tags table (many-to-many)
  `
  CREATE TABLE IF NOT EXISTS action_tags (
    action_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (action_id, tag),
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE
  );
  `,

  // Categories table (for reference)
  `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
  );
  `,

  // Subcategories table
  `
  CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, name)
  );
  `,

  // General reports table
  `
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    week TEXT,
    member_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `,

  // Create indexes for better performance
  `
  CREATE INDEX IF NOT EXISTS idx_actions_member_id ON actions(member_id);
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_actions_category ON actions(category);
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_status_updates_action_id ON status_updates(action_id);
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_status_updates_week ON status_updates(week);
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_weekly_reports_member_week ON weekly_reports(member_id, week);
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_reports_member_id ON reports(member_id);
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_reports_week ON reports(week);
  `,
];

export async function migrate() {
  const db = getDatabase();
  
  console.log('Running database migrations...');
  
  try {
    for (const migration of migrations) {
      await db.run(migration);
    }
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
