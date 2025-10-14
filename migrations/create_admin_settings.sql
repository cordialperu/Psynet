-- Create admin_settings table for storing admin contact information
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name VARCHAR(255) NOT NULL,
  admin_whatsapp VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin settings (only if table is empty)
INSERT INTO admin_settings (admin_name, admin_whatsapp)
SELECT 'Admin', '+51 987 654 321'
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Add comment
COMMENT ON TABLE admin_settings IS 'Stores admin contact information for WhatsApp notifications';
