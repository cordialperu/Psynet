-- Make phone optional and whatsapp required
ALTER TABLE guides 
ALTER COLUMN phone DROP NOT NULL;

-- Make whatsapp required if it's not already
ALTER TABLE guides 
ALTER COLUMN whatsapp SET NOT NULL;

-- Update any existing records that have phone but no whatsapp
UPDATE guides 
SET whatsapp = phone 
WHERE whatsapp IS NULL AND phone IS NOT NULL;

COMMENT ON COLUMN guides.phone IS 'Optional phone number (legacy field)';
COMMENT ON COLUMN guides.whatsapp IS 'WhatsApp number for customer contact (required)';
