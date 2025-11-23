-- Migration: Create profile table
-- Description: Store user profile information for portfolio homepage

CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    profile_image_url TEXT,
    
    -- Hero section
    hero_title VARCHAR(255) NOT NULL,
    hero_subtitle TEXT NOT NULL,
    available_for_work BOOLEAN DEFAULT true,
    
    -- Social links
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile data
INSERT INTO profile (
    name,
    title,
    bio,
    email,
    hero_title,
    hero_subtitle,
    available_for_work,
    profile_image_url
) VALUES (
    'Mboh Bless Pearl N',
    'AI Engineer & Software Developer',
    'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
    'mbohblesspearl@gmail.com',
    'AI Engineer & Software Developer',
    'Building intelligent systems and scalable software solutions. Specialized in machine learning, artificial intelligence, and modern web technologies.',
    true,
    '/images/profile.png'
);

-- Create index for faster lookups
CREATE INDEX idx_profile_email ON profile(email);
