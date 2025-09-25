-- SQL file to insert users into the smart_report database
-- Usage: sqlite3 smart_report.db < insert_users.sql
-- Or: sqlite3 smart_report.db ".read insert_users.sql"

-- Note: Password hashes below are for demonstration. 
-- In production, generate proper bcrypt hashes for actual passwords.

-- Sample users with different roles
INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) VALUES
(
    'cd1202cc-f515-4f7e-8217-b66c3ba09a5e',
    'nmtuan3@tma.com.vn',
    'Tuan Nguyen',
    '$2a$10$OEx9StypHUsT6yFwArEDH.qDcq.lucm6bIcs48IFiJWx4MNeP5I86', -- password: admin123
    'user',
    datetime('now'),
    datetime('now')
),
(
    '04a01063-3860-419b-8b1b-5400bb3ea3e5',
    'nthau3@tma.com.vn',
    'Hau Nguyen',
    '$2a$10$hp/sUMgaCqDSk1X7zZXoMObWZxJ9uQ3bJjl2C7O5e4WAAD6W5/mg6', -- password: user123
    'user',
    datetime('now'),
    datetime('now')
),
(
    'd71ccdc1-544b-4f2f-9d56-ca76603ee2a6',
    'pgnguyen@tma.com.vn',
    'Nguyen Pham',
    '$2a$10$OEx9StypHUsT6yFwArEDH.qDcq.lucm6bIcs48IFiJWx4MNeP5I86', -- password: admin123
    'user',
    datetime('now'),
    datetime('now')
),
(
    'cd1e0606-86a8-42a7-9102-b61c639d361a',
    'ttkimngan@tma.com.vn',
    'Ngan To',
    '$2a$10$hp/sUMgaCqDSk1X7zZXoMObWZxJ9uQ3bJjl2C7O5e4WAAD6W5/mg6', -- password: user123
    'user',
    datetime('now'),
    datetime('now')
),
(
    '21d2b5ca-a7d0-43bd-8cea-a3fb725bf857',
    'tnyen@tma.com.vn',
    'Yen Tran',
    '$2a$10$OEx9StypHUsT6yFwArEDH.qDcq.lucm6bIcs48IFiJWx4MNeP5I86', -- password: admin123
    'user',
    datetime('now'),
    datetime('now')
);

-- Template for adding new users manually:
-- Copy and modify the following template as needed:

/*
INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) VALUES
(
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', -- Generate a new UUID
    'email@example.com',                    -- Unique email address
    'Full Name',                           -- User's full name
    'bcrypt_password_hash_here',           -- Generate bcrypt hash for password
    'user',                               -- Role: 'user' or 'admin'
    datetime('now'),                      -- Created timestamp
    datetime('now')                       -- Updated timestamp
);
*/

-- Tips for manual updates:
-- 1. Generate UUIDs using online tools or: SELECT lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)));
-- 2. Generate bcrypt hashes using online tools or Node.js: bcrypt.hashSync('password', 10)
-- 3. Ensure email addresses are unique
-- 4. Use 'user' or 'admin' for role field

-- Example of generating UUID in SQLite:
-- SELECT lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))) as uuid;
