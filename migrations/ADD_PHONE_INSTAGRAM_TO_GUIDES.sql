-- Agregar campos de teléfono e Instagram a la tabla de guías
-- Estos campos son obligatorios para el registro

-- Agregar columnas
ALTER TABLE guides ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS instagram VARCHAR(100);

-- Para guías existentes, agregar valores por defecto temporales
UPDATE guides 
SET phone = '+51000000000' 
WHERE phone IS NULL;

UPDATE guides 
SET instagram = '@pendiente' 
WHERE instagram IS NULL;

-- Hacer los campos NOT NULL después de agregar valores por defecto
ALTER TABLE guides ALTER COLUMN phone SET NOT NULL;
ALTER TABLE guides ALTER COLUMN instagram SET NOT NULL;
