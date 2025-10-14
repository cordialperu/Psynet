-- Add sessions table for persistent authentication
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  is_master BOOLEAN DEFAULT FALSE,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_session_id ON sessions(session_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_guide_id ON sessions(guide_id);

-- Add favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  therapy_id UUID REFERENCES therapies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guide_id, therapy_id)
);

CREATE INDEX idx_favorites_guide_id ON favorites(guide_id);
CREATE INDEX idx_favorites_therapy_id ON favorites(therapy_id);

-- Add reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapy_id UUID REFERENCES therapies(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_therapy_id ON reviews(therapy_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Add audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_guide_id ON audit_logs(guide_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Add soft delete and tracking fields to therapies
ALTER TABLE therapies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE therapies ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE therapies ADD COLUMN IF NOT EXISTS whatsapp_clicks INTEGER DEFAULT 0;

-- Add optimized indexes for therapies
CREATE INDEX IF NOT EXISTS idx_therapies_published ON therapies(published) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_therapies_category ON therapies(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_therapies_type ON therapies(type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_therapies_location ON therapies(location) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_therapies_price ON therapies(price) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_therapies_deleted_at ON therapies(deleted_at);
CREATE INDEX IF NOT EXISTS idx_therapies_created_at ON therapies(created_at);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_therapies_search ON therapies 
  USING gin(to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(guide_name, '')))
  WHERE deleted_at IS NULL;

-- Add configuration table
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO app_config (key, value, description) VALUES
  ('platform_fee_percentage', '25', 'Platform commission percentage'),
  ('master_code', '"333"', 'Master admin access code'),
  ('max_video_duration_seconds', '60', 'Maximum video duration in seconds'),
  ('items_per_page', '20', 'Default items per page for pagination')
ON CONFLICT (key) DO NOTHING;

-- Add guide verification fields
ALTER TABLE guides ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS verification_documents JSONB;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Add password requirements tracking
ALTER TABLE guides ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE guides ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
