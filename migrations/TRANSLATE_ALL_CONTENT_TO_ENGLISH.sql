-- Translate all content to English
-- This migration translates titles, descriptions, locations, and durations

-- Update existing Spanish content to English
UPDATE therapies SET 
  title = 'Individual Ayahuasca Ceremony',
  description = 'Personalized ayahuasca ceremony with experienced shaman. Includes pre-ceremony consultation, ceremony, and post-integration session.',
  location = 'Cusco, Peru',
  duration = '1 night'
WHERE title = 'Ceremonia de Ayahuasca Individual';

UPDATE therapies SET 
  title = '3-Day Ayahuasca Retreat',
  description = 'Immerse yourself in a transformative 3-day ayahuasca ceremony in the Sacred Valley. Includes preparation, 2 ceremonies, integration, and accommodation.',
  location = 'Sacred Valley, Cusco, Peru',
  duration = '3 days, 2 nights'
WHERE title = 'Retiro de Ayahuasca de 3 días';

UPDATE therapies SET 
  title = 'San Pedro Retreat at Machu Picchu',
  description = 'Sacred journey combining San Pedro medicine with a visit to Machu Picchu. Includes ceremony, guided tour, and integration.',
  location = 'Machu Picchu, Cusco, Peru',
  duration = '2 days, 1 night'
WHERE title = 'Retiro San Pedro Machu Picchu';

UPDATE therapies SET 
  title = 'Integral Holistic Therapy',
  description = 'Comprehensive holistic therapy combining energy work, meditation, and natural healing techniques for physical and emotional well-being.',
  location = 'Lima, Peru',
  duration = '90 minutes'
WHERE title = 'Terapia Holística Integral';

UPDATE therapies SET 
  title = 'Reiki Session',
  description = 'Energy healing session using Reiki techniques to balance chakras and promote deep relaxation and healing.',
  location = 'Miraflores, Lima, Peru',
  duration = '60 minutes'
WHERE title = 'Sesión de Reiki';

UPDATE therapies SET 
  title = 'Psilocybin Microdosing Protocol',
  description = '30-day psilocybin microdosing protocol following the Fadiman method. Includes consultation, dosage guide, and follow-up support.',
  duration = '30 days'
WHERE title = 'Protocolo Microdosis Psilocibina';

UPDATE therapies SET 
  title = 'Stamets Stack - Microdosing',
  description = 'Paul Stamets protocol combining psilocybin, lion''s mane, and niacin for cognitive enhancement and neurogenesis.',
  duration = '4 weeks'
WHERE title LIKE '%Stack Stamets%' OR title LIKE '%Stack Completo%';

UPDATE therapies SET 
  title = 'Ceremonial Rapé',
  description = 'Traditional Amazonian tobacco snuff used for grounding, cleansing, and spiritual connection. Includes application and guidance.',
  duration = '30 minutes'
WHERE title = 'Rapé Ceremonial' OR title LIKE '%Rapé%Amazonian%';

UPDATE therapies SET 
  title = 'Kambo Detox',
  description = 'Traditional Amazonian frog medicine for deep physical and energetic cleansing. Includes preparation, application, and integration.',
  duration = '2 hours'
WHERE title LIKE '%Kambo%' AND category = 'medicina';

UPDATE therapies SET 
  title = 'Cacao Circle',
  description = 'Heart-opening ceremonial cacao circle with meditation, sharing, and community connection.',
  location = 'Barranco, Lima, Peru',
  duration = '3 hours'
WHERE title = 'Círculo de Cacao' OR title LIKE '%Cacao Circle%';

UPDATE therapies SET 
  title = 'Temazcal - Sweat Lodge Ceremony',
  description = 'Traditional sweat lodge ceremony for purification, healing, and spiritual renewal.',
  location = 'Sacred Valley, Peru',
  duration = '4 hours'
WHERE title LIKE '%Temazcal%';

UPDATE therapies SET 
  title = 'Palo Santo Incense',
  description = 'Sacred wood from Peru used for cleansing spaces, meditation, and spiritual practices. 100% natural and sustainably sourced.'
WHERE title LIKE '%Palo Santo%' AND category = 'productos';

UPDATE therapies SET 
  title = 'Ceremonial Mapacho',
  description = 'Traditional Amazonian tobacco used in ceremonies and healing rituals. Organic and wildcrafted.'
WHERE title = 'Mapacho Ceremonial' OR (title LIKE '%Mapacho%' AND category = 'medicina');

UPDATE therapies SET 
  title = 'Shamanic Drumming Circle',
  description = 'Community drumming circle for connection, rhythm, and shamanic journey work.',
  location = 'Lima, Peru',
  duration = '2 hours'
WHERE title LIKE '%Tambores Cham%';

UPDATE therapies SET 
  title = 'Tibetan Singing Bowls Concert',
  description = 'Sound healing concert with Tibetan singing bowls for deep relaxation and meditation.',
  location = 'Cusco, Peru',
  duration = '90 minutes'
WHERE title LIKE '%Cuencos Tibetanos%';

UPDATE therapies SET 
  title = 'Devotional Kirtan - Sacred Chanting',
  description = 'Heart-opening devotional chanting circle with traditional mantras and live music.',
  location = 'Lima, Peru',
  duration = '2 hours'
WHERE title LIKE '%Kirtan%';

UPDATE therapies SET 
  title = 'Zafu Meditation Cushion',
  description = 'Traditional round meditation cushion filled with buckwheat hulls. Perfect for extended meditation sessions.'
WHERE title LIKE '%Cojín de Meditación%' OR title LIKE '%Zafu%';

UPDATE therapies SET 
  title = 'Full Moon Outdoor Concert',
  description = 'Magical outdoor music experience under the full moon with live musicians and nature sounds.',
  location = 'Sacred Valley, Peru',
  duration = '4 hours'
WHERE title LIKE '%Música al Aire Libre%' OR title LIKE '%Full Moon%';

UPDATE therapies SET 
  title = 'Microdosing Starter Kit',
  description = 'Complete beginner-friendly microdosing kit with protocol guide, dosage instructions, and support materials.',
  duration = '30 days'
WHERE title LIKE '%Starter Kit%' OR title LIKE '%Principiantes%';

UPDATE therapies SET 
  title = 'Iboga Microdose - Addiction Support',
  description = 'Iboga microdosing protocol specifically designed for addiction recovery support. Includes consultation and guidance.'
WHERE title LIKE '%Iboga%';

UPDATE therapies SET 
  title = 'Complete Energy Cleansing Kit',
  description = 'Full kit for energetic cleansing including palo santo, sage, crystals, and instruction guide.'
WHERE title LIKE '%Kit de Limpieza Energética%';

UPDATE therapies SET 
  title = 'CBD Oil - Full Spectrum',
  description = 'High-quality full-spectrum CBD oil for anxiety relief, pain management, and overall wellness. Lab-tested and organic.'
WHERE title LIKE '%CBD%' OR title LIKE '%Aceite de CBD%';

UPDATE therapies SET 
  title = 'Traditional Florida Water',
  description = 'Authentic Agua Florida for spiritual cleansing, protection, and blessing rituals. Traditional Peruvian formula.'
WHERE title LIKE '%Agua Florida%';

UPDATE therapies SET 
  title = 'Amazonian Icaros Workshop',
  description = 'Learn traditional Amazonian healing songs (icaros) used in plant medicine ceremonies. 2-day intensive workshop.',
  location = 'Iquitos, Peru',
  duration = '2 days'
WHERE title LIKE '%Icaros%' OR title LIKE '%Cantos%';

UPDATE therapies SET 
  title = 'Quartz Pendulum for Dowsing',
  description = 'Natural quartz crystal pendulum for energy work, divination, and radiesthesia practices.'
WHERE title LIKE '%Péndulo%';

UPDATE therapies SET 
  title = 'Dragon''s Blood Resin',
  description = 'Amazonian Dragon''s Blood resin for healing wounds, protection, and spiritual cleansing. Pure and wildcrafted.'
WHERE title LIKE '%Dragon%' OR title LIKE '%Sangre de Grado%';

UPDATE therapies SET 
  title = 'Sananga Eye Drops',
  description = 'Traditional Amazonian eye drops for vision enhancement, spiritual clarity, and energetic cleansing.'
WHERE title LIKE '%Sananga%';

UPDATE therapies SET 
  title = 'Copal Resin - Mayan Incense',
  description = 'Sacred Mayan copal resin for ceremonies, meditation, and space cleansing. Traditional and pure.'
WHERE title LIKE '%Copal%';

UPDATE therapies SET 
  title = 'Bobinsana Tincture',
  description = 'Heart-opening plant medicine tincture from the Amazon. Used for emotional healing and opening the heart chakra.'
WHERE title LIKE '%Bobinsana%';

UPDATE therapies SET 
  title = 'Chuchuhuasi Bark',
  description = 'Traditional Amazonian plant medicine for strength, vitality, and joint health. Wildcrafted and organic.'
WHERE title LIKE '%Chuchuhuasi%';

UPDATE therapies SET 
  title = 'Ayahuasca Vine - Banisteriopsis Caapi',
  description = 'Pure ayahuasca vine (Banisteriopsis caapi) for traditional preparation. Sustainably harvested from the Amazon.'
WHERE title LIKE '%Ayahuasca Vine%' OR title LIKE '%Banisteriopsis%';

UPDATE therapies SET 
  title = 'Chacruna Leaves - Psychotria Viridis',
  description = 'Pure chacruna leaves (Psychotria viridis) containing DMT. Essential ingredient for ayahuasca preparation.'
WHERE title LIKE '%Chacruna%';

UPDATE therapies SET 
  title = 'Ajo Sacha Tincture',
  description = 'Amazonian "forest garlic" tincture for immune support, energy, and spiritual protection.'
WHERE title LIKE '%Ajo Sacha%';

UPDATE therapies SET 
  title = 'Cat''s Claw - Uña de Gato',
  description = 'Powerful Amazonian immune-boosting plant. Anti-inflammatory and healing properties. Organic and wildcrafted.'
WHERE title LIKE '%Uña de Gato%' OR title LIKE '%Cat''s Claw%';

UPDATE therapies SET 
  title = 'Guayusa Tea - Amazonian Energy',
  description = 'Traditional Amazonian tea for clean energy, focus, and lucid dreaming. Organic and fair trade.'
WHERE title LIKE '%Guayusa%';

UPDATE therapies SET 
  title = 'Women''s Healing Retreat - 5 Days',
  description = 'Sacred space for women to heal, connect, and empower. Includes ceremonies, workshops, and sisterhood circles.',
  location = 'Sacred Valley, Peru',
  duration = '5 days, 4 nights'
WHERE title LIKE '%Women%' AND category = 'eventos';

UPDATE therapies SET 
  title = 'Plant Medicine Conference - 3 Days',
  description = 'International conference on plant medicine research, traditional wisdom, and therapeutic applications.',
  location = 'Lima, Peru',
  duration = '3 days'
WHERE title LIKE '%Conference%' OR title LIKE '%Conferencia%';

UPDATE therapies SET 
  title = 'Ecstatic Dance Journey',
  description = 'Free-form conscious dance experience for embodiment, expression, and joy. No steps, no judgment.',
  location = 'Barranco, Lima, Peru',
  duration = '2 hours'
WHERE title LIKE '%Ecstatic Dance%' OR title LIKE '%Danza Extática%';

UPDATE therapies SET 
  title = 'Psychedelic Integration Workshop',
  description = '2-day workshop for integrating psychedelic experiences into daily life. Includes group work and individual sessions.',
  location = 'Lima, Peru',
  duration = '2 days'
WHERE title LIKE '%Integration Workshop%' OR title LIKE '%Integración%';

UPDATE therapies SET 
  title = 'Sacred Music Festival - 3 Days',
  description = 'Three-day festival celebrating sacred music traditions from around the world. Live performances and workshops.',
  location = 'Cusco, Peru',
  duration = '3 days'
WHERE title LIKE '%Music Festival%' OR title LIKE '%Festival%';

UPDATE therapies SET 
  title = 'Breathwork & Ice Bath Experience',
  description = 'Wim Hof method combining breathwork and cold exposure for resilience, energy, and mental clarity.',
  location = 'Lima, Peru',
  duration = '3 hours'
WHERE title LIKE '%Ice Bath%' OR title LIKE '%Breathwork%';

UPDATE therapies SET 
  title = 'Yoga & Meditation Immersion - 7 Days',
  description = 'Week-long yoga and meditation retreat in the Sacred Valley. All levels welcome.',
  location = 'Sacred Valley, Peru',
  duration = '7 days, 6 nights'
WHERE title LIKE '%Yoga%Meditation%Immersion%';

UPDATE therapies SET 
  title = 'Conscious Business Summit',
  description = 'Summit for conscious entrepreneurs and business leaders. Networking, workshops, and inspiration.',
  location = 'Lima, Peru',
  duration = '2 days'
WHERE title LIKE '%Business Summit%' OR title LIKE '%Conscious Business%';

UPDATE therapies SET 
  title = 'Sacred Geometry Workshop',
  description = 'Learn the principles of sacred geometry and their applications in art, architecture, and spirituality.',
  location = 'Cusco, Peru',
  duration = '1 day'
WHERE title LIKE '%Sacred Geometry%' OR title LIKE '%Geometría Sagrada%';

UPDATE therapies SET 
  title = 'Tantra & Sacred Sexuality Retreat',
  description = '4-day retreat exploring tantra, sacred sexuality, and conscious relating. For individuals and couples.',
  location = 'Sacred Valley, Peru',
  duration = '4 days, 3 nights'
WHERE title LIKE '%Tantra%' OR title LIKE '%Sacred Sexuality%';

UPDATE therapies SET 
  title = 'Permaculture & Plant Medicine Workshop',
  description = 'Learn sustainable permaculture practices while connecting with plant medicines. Hands-on experience.',
  location = 'Amazon, Peru',
  duration = '5 days'
WHERE title LIKE '%Permaculture%' OR title LIKE '%Permacultura%';

UPDATE therapies SET 
  title = 'Sound Healing Training - Certification',
  description = 'Professional sound healing certification course. Learn to use singing bowls, gongs, and voice for healing.',
  location = 'Cusco, Peru',
  duration = '10 days'
WHERE title LIKE '%Sound Healing Training%' OR title LIKE '%Certification%';

UPDATE therapies SET 
  title = 'Organic Cotton Meditation Cushion Set',
  description = 'Complete meditation cushion set made with organic cotton. Includes zafu and zabuton for comfortable practice.'
WHERE title LIKE '%Meditation Cushion Set%' OR title LIKE '%Cojín%Meditación%Organic%';

UPDATE therapies SET 
  title = 'Crystal Singing Bowl - 432Hz',
  description = 'Pure quartz crystal singing bowl tuned to 432Hz for healing, meditation, and sound therapy.'
WHERE title LIKE '%Crystal Singing Bowl%' OR title LIKE '%Cuenco de Cristal%';

UPDATE therapies SET 
  title = 'Flower of Life Wall Art',
  description = 'Sacred geometry wall art featuring the Flower of Life pattern. Handcrafted and blessed.'
WHERE title LIKE '%Flower of Life%' OR title LIKE '%Flor de la Vida%';

UPDATE therapies SET 
  title = 'Tibetan Singing Bowl Set - 7 Chakras',
  description = 'Complete set of 7 Tibetan singing bowls, each tuned to a specific chakra frequency. Includes mallets and cushions.'
WHERE title LIKE '%Tibetan Singing Bowl%7%' OR title LIKE '%7 Chakras%';

UPDATE therapies SET 
  title = 'Handwoven Alpaca Meditation Blanket',
  description = 'Luxurious handwoven alpaca blanket for meditation and ceremonies. Made by Peruvian artisans.'
WHERE title LIKE '%Alpaca%Blanket%' OR title LIKE '%Manta%Alpaca%';

UPDATE therapies SET 
  title = 'Ceremonial Cacao Paste - 1kg',
  description = 'Pure ceremonial-grade cacao paste from Peru. Perfect for cacao ceremonies and heart-opening rituals.'
WHERE title LIKE '%Cacao Paste%' OR title LIKE '%Pasta de Cacao%';

UPDATE therapies SET 
  title = 'Sage & Palo Santo Smudge Kit',
  description = 'Complete smudging kit with white sage, palo santo, abalone shell, and feather. For space cleansing and ceremonies.'
WHERE title LIKE '%Smudge Kit%' OR title LIKE '%Kit%Limpieza%';

UPDATE therapies SET 
  title = 'Crystal Healing Set - 7 Chakras',
  description = 'Complete set of 7 crystals for chakra healing and energy work. Includes guide and storage pouch.'
WHERE title LIKE '%Crystal Healing Set%' OR title LIKE '%Piedras%Chakra%';

UPDATE therapies SET 
  title = 'Handmade Rapé Applicator Set',
  description = 'Traditional rapé applicator set including kuripe (self-applicator) and tepi (for others). Handcrafted wood.'
WHERE title LIKE '%Rapé Applicator%' OR title LIKE '%Kuripe%Tepi%';

UPDATE therapies SET 
  title = 'Natural Rubber & Cork Yoga Mat',
  description = 'Eco-friendly yoga mat made from natural rubber and cork. Non-slip, sustainable, and biodegradable.'
WHERE title LIKE '%Yoga Mat%' OR title LIKE '%Tapete%Yoga%';

UPDATE therapies SET 
  title = 'Mala Beads - 108 Rudraksha Seeds',
  description = 'Traditional 108-bead mala made with authentic rudraksha seeds. For meditation, mantra, and prayer.'
WHERE title LIKE '%Mala Beads%' OR title LIKE '%Rudraksha%';

UPDATE therapies SET 
  title = 'Handcarved Wood Incense Holder',
  description = 'Beautiful handcarved wooden incense holder. Artisan-made in Peru with sustainable wood.'
WHERE title LIKE '%Incense Holder%' OR title LIKE '%Porta Incienso%';

UPDATE therapies SET 
  title = 'Plant Medicine Journal',
  description = 'Handmade journal with recycled paper for documenting your plant medicine journey and integration work.'
WHERE title LIKE '%Plant Medicine Journal%' OR title LIKE '%Diario%Medicina%';

UPDATE therapies SET 
  title = 'Handcrafted Shamanic Drum',
  description = 'Traditional shamanic drum handcrafted with buffalo hide. Perfect for journeying and ceremonies.'
WHERE title LIKE '%Shamanic Drum%' OR title LIKE '%Tambor Chamánico%';

UPDATE therapies SET 
  title = 'Palo Santo Incense Sticks - 50 Pack',
  description = 'Natural palo santo incense sticks from Peru. Sustainably harvested for cleansing and meditation.'
WHERE title LIKE '%Incienso%Palo Santo%50%' OR title LIKE '%50 varitas%';

-- Update any remaining Spanish locations
UPDATE therapies SET location = 'Lima, Peru' WHERE location LIKE '%Lima%Perú%';
UPDATE therapies SET location = 'Cusco, Peru' WHERE location LIKE '%Cusco%Perú%';
UPDATE therapies SET location = 'Sacred Valley, Peru' WHERE location LIKE '%Valle Sagrado%';
UPDATE therapies SET location = 'Iquitos, Peru' WHERE location LIKE '%Iquitos%Perú%';
UPDATE therapies SET location = 'Amazon, Peru' WHERE location LIKE '%Amazonas%Perú%' OR location LIKE '%Amazonia%Perú%';

-- Update duration formats
UPDATE therapies SET duration = '1 hour' WHERE duration LIKE '%1 hora%';
UPDATE therapies SET duration = '2 hours' WHERE duration LIKE '%2 horas%';
UPDATE therapies SET duration = '3 hours' WHERE duration LIKE '%3 horas%';
UPDATE therapies SET duration = '90 minutes' WHERE duration LIKE '%90 minutos%';
UPDATE therapies SET duration = '1 day' WHERE duration LIKE '%1 día%';
UPDATE therapies SET duration = '2 days' WHERE duration LIKE '%2 días%';
UPDATE therapies SET duration = '3 days' WHERE duration LIKE '%3 días%';
UPDATE therapies SET duration = '5 days' WHERE duration LIKE '%5 días%';
UPDATE therapies SET duration = '7 days' WHERE duration LIKE '%7 días%';
UPDATE therapies SET duration = '10 days' WHERE duration LIKE '%10 días%';
UPDATE therapies SET duration = '30 days' WHERE duration LIKE '%30 días%';
UPDATE therapies SET duration = '3 months' WHERE duration LIKE '%3 meses%';
UPDATE therapies SET duration = '1 night' WHERE duration LIKE '%1 noche%';
UPDATE therapies SET duration = '2 nights' WHERE duration LIKE '%2 noches%';
UPDATE therapies SET duration = '3 nights' WHERE duration LIKE '%3 noches%';
UPDATE therapies SET duration = '4 nights' WHERE duration LIKE '%4 noches%';
UPDATE therapies SET duration = '6 nights' WHERE duration LIKE '%6 noches%';
