-- Add paypal_email column to admin_settings
ALTER TABLE admin_settings
ADD COLUMN IF NOT EXISTS paypal_email varchar(255);
