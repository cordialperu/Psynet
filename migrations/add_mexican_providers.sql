-- Migration: Add Mexican Providers
-- This migration adds sample providers from Mexico across different categories

-- CENTROS DE RETIRO Y SANACIÓN (Retreat Centers)
INSERT INTO therapies (title, slug, type, category, country, description, location, price, currency, published, approval_status, whatsapp_number) VALUES
('Kriya Yoga Shala - Retiro de Yoga', 'kriya-yoga-shala-retiro-mx-001', 'temazcal', 'ceremonias', 'MX', 'Retiros de yoga y meditación en la naturaleza. Experimenta la transformación a través de prácticas ancestrales en un entorno natural privilegiado.', 'México', '150', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Hridaya Yoga Mazunte', 'hridaya-yoga-mazunte-mx-002', 'temazcal', 'ceremonias', 'MX', 'Retiros de yoga y meditación Hridaya en Mazunte. Conecta con tu corazón espiritual en la costa de Oaxaca.', 'Mazunte, Oaxaca', '200', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Satyaloka Tepoztlán', 'satyaloka-tepoztlan-mx-003', 'temazcal', 'ceremonias', 'MX', 'Retiros de meditación, yoga y ceremonias en el místico pueblo de Tepoztlán, rodeado de montañas sagradas.', 'Tepoztlán, Morelos', '180', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('ASHA Awakening & Healing', 'asha-awakening-healing-mx-004', 'plant-medicine', 'ceremonias', 'MX', 'Retiros de sanación y desarrollo personal. Transforma tu vida a través de prácticas holísticas y medicina ancestral.', 'México', '250', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('La Calma Tepoztlán', 'la-calma-tepoztlan-mx-005', 'temazcal', 'ceremonias', 'MX', 'Retiros de yoga y bienestar, hospedaje holístico en un ambiente de paz y tranquilidad.', 'Tepoztlán, Morelos', '120', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Nierika - Medicina Wixárika', 'nierika-medicina-wixarika-mx-006', 'plant-medicine', 'ceremonias', 'MX', 'Retiros y ceremonias con medicina Wixárika (Peyote). Conexión profunda con la tradición Huichol.', 'Wirikuta, San Luis Potosí', '300', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('APL Shamanic Journeys', 'apl-shamanic-journeys-mx-007', 'ayahuasca', 'ceremonias', 'MX', 'Retiros de Ayahuasca y plantas maestras. Viaje chamánico guiado por facilitadores experimentados.', 'México', '280', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Origen Sagrado', 'origen-sagrado-mx-008', 'ayahuasca', 'ceremonias', 'MX', 'Retiros y ceremonias de Ayahuasca y Bufo Alvarius. Sanación profunda y expansión de conciencia.', 'México', '350', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Buena Vida Oaxaca', 'buena-vida-oaxaca-mx-009', 'plant-medicine', 'ceremonias', 'MX', 'Retiros de hongos de psilocibina en Oaxaca. Experiencia transformadora en la tierra de María Sabina.', 'Oaxaca', '200', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('The Buena Vibra Retreat', 'buena-vibra-retreat-mx-010', 'temazcal', 'ceremonias', 'MX', 'Retiros de yoga, meditación y bienestar en Tepoztlán. Eleva tu vibración en un espacio sagrado.', 'Tepoztlán, Morelos', '160', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Xinalani Retreat', 'xinalani-retreat-mx-011', 'temazcal', 'ceremonias', 'MX', 'Retiros de yoga de lujo cerca de Puerto Vallarta. Combina bienestar con belleza natural.', 'Puerto Vallarta, Jalisco', '400', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Present Moment Retreat', 'present-moment-retreat-mx-012', 'temazcal', 'ceremonias', 'MX', 'Retiros de yoga y bienestar en Troncones. Vive el momento presente frente al océano Pacífico.', 'Troncones, Guerrero', '220', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Holistika Tulum', 'holistika-tulum-mx-013', 'temazcal', 'ceremonias', 'MX', 'Hotel holístico con yoga, temazcal y terapias. Experiencia integral de bienestar en el Caribe mexicano.', 'Tulum, Quintana Roo', '180', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Azulik Tulum', 'azulik-tulum-mx-014', 'temazcal', 'ceremonias', 'MX', 'Hotel y centro de bienestar con enfoque en reconexión. Arquitectura única y experiencias transformadoras.', 'Tulum, Quintana Roo', '500', 'USD', true, 'approved', '+52-xxx-xxx-xxxx');

-- CEREMONIAS Y TERAPIAS ANCESTRALES
INSERT INTO therapies (title, slug, type, category, country, description, location, price, currency, published, approval_status, whatsapp_number) VALUES
('Temazcal Teocalli', 'temazcal-teocalli-mx-015', 'temazcal', 'ceremonias', 'MX', 'Ceremonias de temazcal tradicional. Purificación y renacimiento en el vientre de la madre tierra.', 'México', '50', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Temazcal Mazatepec', 'temazcal-mazatepec-mx-016', 'temazcal', 'ceremonias', 'MX', 'Temazcales y ceremonias en un entorno natural. Sanación ancestral mexicana.', 'Mazatepec, Morelos', '45', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Cacao Ceremony Mexico', 'cacao-ceremony-mexico-mx-017', 'cacao-ceremony', 'ceremonias', 'MX', 'Organización de ceremonias de cacao. Abre tu corazón con la medicina del cacao sagrado.', 'Ciudad de México', '40', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Soy Cacao', 'soy-cacao-mx-018', 'cacao-ceremony', 'ceremonias', 'MX', 'Ceremonias de cacao, formación y venta de producto. Cacao ceremonial de la más alta calidad.', 'México', '45', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Viajes a Wirikuta', 'viajes-wirikuta-mx-019', 'plant-medicine', 'ceremonias', 'MX', 'Guías y tours para la peregrinación a Wirikuta. Experiencia sagrada en el desierto Huichol.', 'Wirikuta, San Luis Potosí', '200', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Ceremonias Kambo México', 'ceremonias-kambo-mexico-mx-020', 'kambo', 'ceremonias', 'MX', 'Sesiones de sanación con la medicina del Kambo. Purificación profunda y fortalecimiento del sistema inmune.', 'México', '80', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Bufo Alvarius México', 'bufo-alvarius-mexico-mx-021', 'plant-medicine', 'ceremonias', 'MX', 'Facilitadores de ceremonias con Bufo Alvarius. Experiencia mística con el sapo del desierto de Sonora.', 'México', '150', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Temazcal del Tío Rulo', 'temazcal-tio-rulo-mx-022', 'temazcal', 'ceremonias', 'MX', 'Temazcal tradicional en el Ajusco, CDMX. Ceremonia auténtica cerca de la ciudad.', 'Ciudad de México', '40', 'USD', true, 'approved', '+52-xxx-xxx-xxxx');

-- TERAPEUTAS Y CENTROS HOLÍSTICOS
INSERT INTO therapies (title, slug, type, category, country, description, location, price, currency, published, approval_status, whatsapp_number) VALUES
('Centro Holístico Coyoacán', 'centro-holistico-coyoacan-mx-023', 'reiki', 'terapias', 'MX', 'Terapias alternativas, masajes y cursos en CDMX. Espacio integral de sanación en el corazón de Coyoacán.', 'Ciudad de México', '60', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Agoralucis', 'agoralucis-mx-024', 'reiki', 'terapias', 'MX', 'Centro de bienestar, yoga y terapias en CDMX. Comunidad consciente y prácticas transformadoras.', 'Ciudad de México', '50', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Sanergia México', 'sanergia-mexico-mx-025', 'reiki', 'terapias', 'MX', 'Terapia de sanación energética y formación. Aprende a canalizar la energía universal.', 'México', '70', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Casa Semilla CDMX', 'casa-semilla-cdmx-mx-026', 'reiki', 'terapias', 'MX', 'Centro de terapias alternativas y yoga. Siembra bienestar en tu vida.', 'Ciudad de México', '55', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Terapias Holísticas Gdl', 'terapias-holisticas-gdl-mx-027', 'reiki', 'terapias', 'MX', 'Directorio y centro de terapias en Guadalajara. Encuentra tu camino de sanación.', 'Guadalajara, Jalisco', '60', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Sonoterapia México', 'sonoterapia-mexico-mx-028', 'reiki', 'terapias', 'MX', 'Terapeutas y centros que ofrecen baños de sonido. Sanación a través de frecuencias vibratorias.', 'México', '65', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Centro de Terapia de Sonido', 'centro-terapia-sonido-mx-029', 'reiki', 'terapias', 'MX', 'Especialistas en terapia de sonido y cuencos. Armonización con instrumentos ancestrales.', 'México', '70', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Reiki México', 'reiki-mexico-mx-030', 'reiki', 'terapias', 'MX', 'Directorio de maestros y terapeutas de Reiki. Encuentra tu sanador de energía universal.', 'México', '50', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Sanación Pránica México', 'sanacion-pranica-mexico-mx-031', 'reiki', 'terapias', 'MX', 'Cursos y terapias de Sanación Pránica. Técnica avanzada de sanación energética.', 'México', '75', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Casa del Ángel CDMX', 'casa-del-angel-cdmx-mx-032', 'reiki', 'terapias', 'MX', 'Centro de desarrollo humano y espiritual. Eleva tu conciencia y sana tu ser.', 'Ciudad de México', '60', 'USD', true, 'approved', '+52-xxx-xxx-xxxx');

-- PRODUCTOS, MICRODOSIS Y HERBOLARIA
INSERT INTO therapies (title, slug, type, category, country, description, location, price, currency, published, approval_status, whatsapp_number) VALUES
('Microdosis México', 'microdosis-mexico-mx-033', 'psilocybin', 'microdosis', 'MX', 'Venta de microdosis de psilocibina. Mejora tu bienestar con dosis sub-perceptuales.', 'México', '30', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Mind Surf', 'mind-surf-mx-034', 'psilocybin', 'microdosis', 'MX', 'Microdosis de psilocibina y productos funcionales. Surfea las olas de tu mente.', 'México', '35', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('NANA MUSHROOMS', 'nana-mushrooms-mx-035', 'psilocybin', 'microdosis', 'MX', 'Microdosis y productos a base de hongos. Hongos medicinales de la más alta calidad.', 'México', '32', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Herbolaria La Fuerza', 'herbolaria-la-fuerza-mx-036', 'herbal', 'medicina', 'MX', 'Tienda de plantas medicinales y productos naturales. Medicina tradicional mexicana.', 'México', '25', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Pacalli', 'pacalli-mx-037', 'herbal', 'medicina', 'MX', 'Herbolaria científica, tinturas y productos naturales. Tradición y ciencia en armonía.', 'México', '28', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Mercado de Sonora', 'mercado-sonora-mx-038', 'herbal', 'medicina', 'MX', 'Sección de herbolaria con múltiples vendedores. El mercado esotérico más famoso de México.', 'Ciudad de México', '20', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Flor de la Vida CBD', 'flor-vida-cbd-mx-039', 'herbal', 'medicina', 'MX', 'Productos de CBD y bienestar. Cannabinoides para tu salud integral.', 'México', '40', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Botica de Árbol', 'botica-arbol-mx-040', 'herbal', 'productos', 'MX', 'Cosmética natural y productos de herbolaria. Belleza y salud desde la naturaleza.', 'México', '35', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Xochicopal', 'xochicopal-mx-041', 'herbal', 'productos', 'MX', 'Venta de copal, resinas sagradas e inciensos. Purifica tu espacio con aromas ancestrales.', 'México', '15', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Shamanic Shop México', 'shamanic-shop-mexico-mx-042', 'herbal', 'productos', 'MX', 'Tienda en línea de artículos chamánicos y esotéricos. Todo para tu práctica espiritual.', 'México', '25', 'USD', true, 'approved', '+52-xxx-xxx-xxxx');

-- EVENTOS, FESTIVALES Y COMUNIDADES
INSERT INTO therapies (title, slug, type, category, country, description, location, price, currency, published, approval_status, whatsapp_number) VALUES
('OMETEOTL Festival', 'ometeotl-festival-mx-043', 'festival', 'eventos', 'MX', 'Festival de música y arte con enfoque en conciencia. Celebración de la dualidad sagrada.', 'México', '100', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Wanderlust 108 México', 'wanderlust-108-mexico-mx-044', 'festival', 'eventos', 'MX', 'Evento masivo de yoga, meditación y running. Mindful triatlón para todos.', 'México', '50', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('The Conscious Circle', 'conscious-circle-mx-045', 'community', 'eventos', 'MX', 'Comunidad y eventos de desarrollo personal. Círculo de conciencia y crecimiento.', 'México', '30', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Ecstatic Dance México', 'ecstatic-dance-mexico-mx-046', 'community', 'eventos', 'MX', 'Eventos de danza consciente en varias ciudades. Libera tu cuerpo, libera tu mente.', 'México', '20', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Mystic Mandrem', 'mystic-mandrem-mx-047', 'community', 'eventos', 'MX', 'Organizadores de eventos y círculos de sanación. Experiencias místicas y transformadoras.', 'México', '35', 'USD', true, 'approved', '+52-xxx-xxx-xxxx'),
('Caravana de Luz', 'caravana-luz-mx-048', 'community', 'eventos', 'MX', 'Eventos holísticos y de sanación itinerantes. Llevamos la luz a todas partes.', 'México', '40', 'USD', true, 'approved', '+52-xxx-xxx-xxxx');

-- Note: WhatsApp numbers are placeholders and should be updated with real contact information
-- All entries are set to published and approved for immediate visibility
-- Prices are in USD and can be adjusted based on actual provider pricing
