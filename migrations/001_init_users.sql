-- Migration 001: Initialize users table
-- This table stores admin users who can manage content
-- Supabase Auth handles authentication, this table stores additional metadata

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Insert default admin user (update with your actual Supabase user ID)
-- You'll need to replace this with your Supabase Auth user UUID after signup
-- Example: INSERT INTO users (id, email, name, role)
--          VALUES ('your-supabase-auth-uuid', 'admin@example.com', 'Admin User', 'admin');

COMMENT ON TABLE users IS 'Admin users who can manage portfolio content';
COMMENT ON COLUMN users.role IS 'User role for authorization: admin (full access), editor (create/edit), viewer (read-only)';
