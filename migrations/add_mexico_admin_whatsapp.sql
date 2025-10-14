-- Add Mexico admin WhatsApp field to admin_settings table
ALTER TABLE admin_settings 
ADD COLUMN IF NOT EXISTS admin_whatsapp_mexico VARCHAR(50);

-- Add comment
COMMENT ON COLUMN admin_settings.admin_whatsapp_mexico IS 'WhatsApp number for Mexico administrator to receive order notifications';
