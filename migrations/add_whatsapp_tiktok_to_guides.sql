-- Add WhatsApp and TikTok columns to guides table
-- Make Instagram and TikTok optional (at least one required via app logic)

ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50),
ADD COLUMN IF NOT EXISTS tiktok VARCHAR(100);

-- Make Instagram nullable (was NOT NULL before)
ALTER TABLE guides 
ALTER COLUMN instagram DROP NOT NULL;

-- Update existing guides to have their phone as whatsapp if null
UPDATE guides 
SET whatsapp = phone 
WHERE whatsapp IS NULL;

-- Add comment
COMMENT ON COLUMN guides.whatsapp IS 'WhatsApp number for customer contact (required)';
COMMENT ON COLUMN guides.tiktok IS 'TikTok username (optional, but at least Instagram or TikTok required)';
COMMENT ON COLUMN guides.instagram IS 'Instagram username (optional, but at least Instagram or TikTok required)';
