-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  primary_specialty VARCHAR(255),
  bio TEXT,
  profile_photo_url TEXT,
  presentation_video_url TEXT,
  active_therapies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create therapies table
CREATE TABLE IF NOT EXISTS therapies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  guide_name VARCHAR(255),
  guide_photo_url TEXT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  type VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  duration VARCHAR(100),
  location VARCHAR(255),
  available_dates DATE[],
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guides_email ON guides(email);
CREATE INDEX IF NOT EXISTS idx_therapies_guide_id ON therapies(guide_id);
CREATE INDEX IF NOT EXISTS idx_therapies_slug ON therapies(slug);
CREATE INDEX IF NOT EXISTS idx_therapies_is_published ON therapies(is_published);
CREATE INDEX IF NOT EXISTS idx_therapies_type ON therapies(type);
