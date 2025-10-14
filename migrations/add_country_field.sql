-- Add country field to therapies table
ALTER TABLE therapies 
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'PE';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_therapies_country ON therapies(country);

-- Update existing records to Peru
UPDATE therapies SET country = 'PE' WHERE country IS NULL;
