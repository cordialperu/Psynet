-- Agregar columna approval_status a la tabla therapies
ALTER TABLE therapies 
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'approved';

-- Actualizar todas las terapias existentes a 'approved' para no afectar el flujo actual
UPDATE therapies 
SET approval_status = 'approved' 
WHERE approval_status IS NULL;

-- Las nuevas terapias creadas por guías tendrán 'pending' por defecto
