-- File: backend/db/migrations/001_create_users_table.sql
-- Description: Create users table in PostgreSQL
-- Author: [Your Name]
-- Created: [Date]

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferences JSONB
);

CREATE INDEX idx_users_email ON users(email);
