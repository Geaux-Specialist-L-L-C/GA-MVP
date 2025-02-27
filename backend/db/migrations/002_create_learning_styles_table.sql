-- File: backend/db/migrations/002_create_learning_styles_table.sql
-- Description: Create learning_styles table in PostgreSQL
-- Author: [Your Name]
-- Created: [Date]

CREATE TABLE learning_styles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    style VARCHAR(255) NOT NULL,
    results JSONB,
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE learning_styles
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX idx_learning_styles_user_id ON learning_styles(user_id);
