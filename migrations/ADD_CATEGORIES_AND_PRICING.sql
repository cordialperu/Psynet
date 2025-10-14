-- Migración: Agregar categorías y sistema de precios con comisión 25%
-- Fecha: 2025-01-05

-- 1. Agregar nuevas columnas a la tabla therapies
ALTER TABLE therapies
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'ceremonias',
ADD COLUMN IF NOT EXISTS base_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS shipping_options JSONB,
ADD COLUMN IF NOT EXISTS inventory INTEGER,
ADD COLUMN IF NOT EXISTS specific_fields JSONB;

-- 2. Migrar datos existentes
-- Copiar el precio actual a base_price y calcular el precio final con comisión
UPDATE therapies
SET 
  base_price = price,
  platform_fee = price * 0.25,
  price = price * 1.25,
  category = 'ceremonias'
WHERE base_price IS NULL;

-- 3. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_therapies_category ON therapies(category);
CREATE INDEX IF NOT EXISTS idx_therapies_published_category ON therapies(is_published, category);

-- 4. Comentarios en las columnas para documentación
COMMENT ON COLUMN therapies.category IS 'Categoría principal: ceremonias, terapias, microdosis, medicina, eventos, productos';
COMMENT ON COLUMN therapies.base_price IS 'Precio base que ingresa el guía (sin comisión)';
COMMENT ON COLUMN therapies.platform_fee IS 'Comisión de la plataforma (25% del base_price)';
COMMENT ON COLUMN therapies.price IS 'Precio final publicado (base_price + platform_fee)';
COMMENT ON COLUMN therapies.google_maps_url IS 'URL de Google Maps para terapias con consultorio';
COMMENT ON COLUMN therapies.shipping_options IS 'Opciones de envío para productos/medicina/microdosis: {envio: boolean, recojo: boolean, address: string}';
COMMENT ON COLUMN therapies.inventory IS 'Stock disponible para productos/medicina/microdosis';
COMMENT ON COLUMN therapies.specific_fields IS 'Campos específicos por categoría en formato JSON flexible';
