import "dotenv/config";
import { db } from "../server/db";
import { therapies, guides } from "@shared/schema";
import { randomUUID } from "crypto";

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + randomUUID().slice(0, 8);
}

// Helper to calculate prices with 25% commission
function calculatePrices(basePrice: number) {
  const platformFee = basePrice * 0.25;
  const finalPrice = basePrice + platformFee;
  return {
    basePrice: basePrice.toFixed(2),
    platformFee: platformFee.toFixed(2),
    price: finalPrice.toFixed(2),
  };
}

async function seedListings() {
  try {
    console.log("🌱 Starting to seed 84 listings in English...");

    // Get first guide
    const [guide] = await db.select({
      id: guides.id,
      fullName: guides.fullName,
      profilePhotoUrl: guides.profilePhotoUrl,
    }).from(guides).limit(1);
    
    if (!guide) {
      console.error("❌ No guide found. Please create a guide first.");
      process.exit(1);
    }

    console.log(`✅ Using guide: ${guide.fullName}`);
    
    // Default WhatsApp number
    const whatsappNumber = "+51987654321";

    // ========== CEREMONIES (14) ==========
    const ceremonies = [
      {
        title: "Traditional Ayahuasca Ceremony in Sacred Valley",
        type: "ayahuasca",
        description: "Experience a profound spiritual journey with traditional Ayahuasca ceremony led by experienced shamans in the Sacred Valley of Peru. This ancient plant medicine has been used for centuries for healing, spiritual growth, and deep self-discovery.\n\nOur ceremony includes:\n- Pre-ceremony preparation and intention setting\n- Traditional icaros (healing songs)\n- Individual attention from experienced facilitators\n- Integration session the following day\n- Safe and sacred ceremonial space\n\nPerfect for those seeking spiritual awakening, emotional healing, or deeper connection with themselves and nature.",
        basePrice: 200,
        duration: "8 hours",
        location: "Sacred Valley, Cusco, Peru",
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
        availableDates: ["2025-11-15", "2025-11-22", "2025-11-29", "2025-12-06"],
      },
      {
        title: "San Pedro Cactus Ceremony - Heart Opening Experience",
        type: "san-pedro",
        description: "Join us for a transformative San Pedro (Wachuma) ceremony in the Andean mountains. This sacred cactus medicine is known as the 'teacher plant' that opens the heart and connects you with Pachamama (Mother Earth).\n\nWhat to expect:\n- Dawn ceremony with mountain views\n- Guided meditation and breathwork\n- Nature walk and connection exercises\n- Heart-opening practices\n- Integration circle\n\nSan Pedro is gentler than Ayahuasca and perfect for first-time plant medicine experiences. The ceremony promotes emotional healing, clarity, and deep connection with nature.",
        basePrice: 150,
        duration: "10 hours",
        location: "Pisac, Sacred Valley, Peru",
        videoUrl: "https://www.youtube.com/watch?v=YVg6CtmVOr0",
        availableDates: ["2025-11-16", "2025-11-23", "2025-11-30", "2025-12-07"],
      },
      {
        title: "Kambo Frog Medicine - Detox & Immunity Boost",
        type: "kambo",
        description: "Experience the powerful cleansing effects of Kambo, a traditional Amazonian medicine derived from the secretion of the giant monkey frog. Used for centuries by indigenous tribes for physical and spiritual purification.\n\nBenefits include:\n- Deep physical detoxification\n- Immune system boost\n- Mental clarity and focus\n- Emotional release\n- Increased energy and vitality\n\nOur experienced practitioners ensure a safe and supportive environment. Includes pre-ceremony consultation, the Kambo application, and post-ceremony care with nourishing foods.",
        basePrice: 120,
        duration: "3 hours",
        location: "Iquitos, Amazon, Peru",
        videoUrl: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
        availableDates: ["2025-11-10", "2025-11-17", "2025-11-24", "2025-12-01"],
      },
      {
        title: "Wachuma Ceremony - Andean Heart Medicine",
        type: "wachuma",
        description: "Wachuma (San Pedro) ceremony in the high Andes, guided by traditional Andean healers. This sacred plant medicine ceremony focuses on heart opening, emotional healing, and connection with the spirit of the mountains.\n\nCeremony includes:\n- Traditional Andean blessing (despacho)\n- Wachuma preparation and consumption\n- Guided mountain meditation\n- Sacred site visit\n- Closing integration circle\n\nIdeal for those seeking emotional healing, spiritual growth, and a deeper connection with Andean wisdom and nature.",
        basePrice: 160,
        duration: "12 hours",
        location: "Ollantaytambo, Peru",
        videoUrl: "https://www.youtube.com/watch?v=kQWAWi-XZqg",
        availableDates: ["2025-11-18", "2025-11-25", "2025-12-02", "2025-12-09"],
      },
      {
        title: "Rapé Ceremony - Sacred Tobacco Medicine",
        type: "rapé",
        description: "Traditional Rapé (sacred tobacco snuff) ceremony with experienced practitioners. Rapé is a powerful grounding medicine used by Amazonian tribes for mental clarity, spiritual connection, and energetic cleansing.\n\nWhat's included:\n- Introduction to Rapé tradition and benefits\n- Individual Rapé application\n- Guided meditation\n- Breathwork exercises\n- Integration and sharing circle\n\nRapé helps clear mental fog, release negative energy, and bring you into the present moment. Perfect for those seeking clarity, focus, and spiritual grounding.",
        basePrice: 80,
        duration: "2 hours",
        location: "Cusco, Peru",
        videoUrl: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
        availableDates: ["2025-11-12", "2025-11-19", "2025-11-26", "2025-12-03"],
      },
      {
        title: "Cacao Ceremony - Heart Opening Ritual",
        type: "cacao-ceremony",
        description: "Sacred Cacao ceremony combining ancient Mayan traditions with modern heart-opening practices. Ceremonial cacao is a gentle yet powerful plant medicine that opens the heart chakra and facilitates emotional healing.\n\nCeremony flow:\n- Opening meditation and intention setting\n- Ceremonial cacao drinking\n- Sound healing with crystal bowls\n- Heart-centered breathwork\n- Dance and movement meditation\n- Closing integration circle\n\nPerfect for those new to plant medicine or seeking a gentle heart-opening experience. Cacao promotes love, connection, and emotional release.",
        basePrice: 60,
        duration: "3 hours",
        location: "Cusco, Peru",
        videoUrl: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
        availableDates: ["2025-11-11", "2025-11-18", "2025-11-25", "2025-12-02"],
      },
      {
        title: "Temazcal Sweat Lodge - Rebirth Ceremony",
        type: "temazcal",
        description: "Traditional Temazcal (sweat lodge) ceremony for physical purification and spiritual rebirth. This ancient Mesoamerican practice uses heat, steam, and sacred herbs to cleanse the body, mind, and spirit.\n\nCeremony includes:\n- Four rounds representing the four directions\n- Sacred songs and prayers\n- Herbal steam with medicinal plants\n- Guided meditation and visualization\n- Cold water cleansing\n- Integration with herbal tea\n\nThe Temazcal represents the womb of Mother Earth, offering a space for deep healing, release, and transformation.",
        basePrice: 90,
        duration: "4 hours",
        location: "Sacred Valley, Peru",
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
        availableDates: ["2025-11-13", "2025-11-20", "2025-11-27", "2025-12-04"],
      },
      {
        title: "Multi-Day Ayahuasca Retreat - Deep Healing Journey",
        type: "ayahuasca",
        description: "Immersive 7-day Ayahuasca retreat in the Amazon rainforest. This comprehensive program includes multiple ceremonies, integration sessions, and supportive practices for deep healing and transformation.\n\nRetreat includes:\n- 4 Ayahuasca ceremonies\n- Daily yoga and meditation\n- Integration workshops\n- Plant medicine teachings\n- Jungle walks and nature connection\n- Nutritious vegetarian meals\n- Private accommodation\n\nLimited to 12 participants for intimate group experience. Perfect for those ready for profound transformation and spiritual awakening.",
        basePrice: 1200,
        duration: "7 days",
        location: "Amazon Rainforest, Peru",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        availableDates: ["2025-12-01", "2025-12-15", "2026-01-05", "2026-01-19"],
      },
      {
        title: "Huachuma Night Ceremony - Star Medicine",
        type: "san-pedro",
        description: "Unique nighttime Huachuma (San Pedro) ceremony under the stars. Experience the magic of this sacred cactus medicine combined with star gazing, fire ceremony, and Andean cosmology teachings.\n\nCeremony highlights:\n- Sunset Huachuma drinking\n- Fire ceremony and offerings\n- Star gazing and astronomy teachings\n- Night meditation and contemplation\n- Sunrise integration\n- Traditional Andean breakfast\n\nThis ceremony offers a different perspective on San Pedro medicine, connecting you with the cosmos and the mysteries of the night.",
        basePrice: 180,
        duration: "14 hours",
        location: "Maras, Sacred Valley, Peru",
        videoUrl: "https://www.youtube.com/watch?v=YVg6CtmVOr0",
        availableDates: ["2025-11-14", "2025-11-21", "2025-11-28", "2025-12-05"],
      },
      {
        title: "Kambo & Rapé Combination - Power Cleanse",
        type: "kambo",
        description: "Powerful combination ceremony featuring both Kambo and Rapé medicines for deep physical and energetic cleansing. This intensive session is designed for experienced medicine users seeking profound purification.\n\nSession includes:\n- Opening Rapé ceremony for grounding\n- Kambo application for physical detox\n- Rest and integration time\n- Closing Rapé for sealing\n- Nourishing meal and hydration\n- Integration guidance\n\nThis combination amplifies the benefits of both medicines, providing comprehensive cleansing on all levels - physical, emotional, mental, and spiritual.",
        basePrice: 150,
        duration: "4 hours",
        location: "Iquitos, Peru",
        videoUrl: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
        availableDates: ["2025-11-15", "2025-11-22", "2025-11-29", "2025-12-06"],
      },
      {
        title: "Sacred Plant Dieta - 10 Day Intensive",
        type: "plant-medicine",
        description: "Traditional Amazonian plant dieta (diet) with master plants for deep healing and spiritual development. This intensive practice involves isolation, dietary restrictions, and daily plant medicine consumption.\n\nDieta includes:\n- Initial Ayahuasca ceremony\n- Daily master plant medicine\n- Isolation in private tambo (hut)\n- Shamanic support and monitoring\n- Dream work and journaling\n- Closing Ayahuasca ceremony\n- Integration session\n\nThe dieta is a powerful traditional practice for developing relationship with plant spirits, receiving teachings, and achieving profound healing. Requires serious commitment and preparation.",
        basePrice: 800,
        duration: "10 days",
        location: "Amazon Jungle, Peru",
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
        availableDates: ["2025-12-01", "2026-01-10", "2026-02-15"],
      },
      {
        title: "Cacao & Sound Healing Journey",
        type: "cacao-ceremony",
        description: "Blissful combination of ceremonial cacao and immersive sound healing. This gentle yet powerful ceremony uses the heart-opening properties of cacao combined with therapeutic sound frequencies.\n\nExperience includes:\n- Ceremonial grade cacao drinking\n- Crystal singing bowl healing\n- Gong bath meditation\n- Tibetan bowl therapy\n- Voice toning and chanting\n- Silent meditation\n- Integration circle\n\nPerfect for stress relief, emotional release, and deep relaxation. No previous experience needed.",
        basePrice: 70,
        duration: "2.5 hours",
        location: "Cusco, Peru",
        videoUrl: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
        availableDates: ["2025-11-12", "2025-11-19", "2025-11-26", "2025-12-03"],
      },
      {
        title: "Women's Ayahuasca Circle - Divine Feminine",
        type: "ayahuasca",
        description: "Sacred Ayahuasca ceremony exclusively for women, focusing on divine feminine healing, womb wisdom, and sisterhood. Led by experienced female facilitators in a safe, nurturing environment.\n\nCeremony includes:\n- Women's circle and intention setting\n- Ayahuasca ceremony with feminine focus\n- Womb healing practices\n- Sisterhood sharing circle\n- Integration with women's wisdom teachings\n- Herbal tea and nourishment\n\nThis ceremony addresses women's specific healing needs including trauma release, reclaiming feminine power, and connecting with ancestral wisdom.",
        basePrice: 220,
        duration: "9 hours",
        location: "Sacred Valley, Peru",
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
        availableDates: ["2025-11-20", "2025-12-04", "2025-12-18"],
      },
      {
        title: "Rapé & Meditation Masterclass",
        type: "rapé",
        description: "Comprehensive workshop combining traditional Rapé medicine with advanced meditation techniques. Learn to work with this sacred tobacco medicine for clarity, focus, and spiritual development.\n\nWorkshop includes:\n- History and tradition of Rapé\n- Different types and their properties\n- Proper application techniques\n- Meditation practices with Rapé\n- Breathwork integration\n- Q&A with experienced practitioners\n- Take-home practice guide\n\nIdeal for those wanting to deepen their Rapé practice or learn to work with this medicine independently.",
        basePrice: 100,
        duration: "4 hours",
        location: "Cusco, Peru",
        videoUrl: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
        availableDates: ["2025-11-16", "2025-11-23", "2025-11-30", "2025-12-07"],
      },
    ];

    // ========== THERAPIES (14) ==========
    const therapiesData = [
      {
        title: "Holistic Reiki Energy Healing Session",
        type: "Reiki Healing",
        description: "Experience the gentle yet powerful healing energy of Reiki. This Japanese technique promotes relaxation, reduces stress, and supports the body's natural healing abilities.\n\nSession includes:\n- Initial consultation and energy assessment\n- Full body Reiki treatment (60 minutes)\n- Chakra balancing\n- Crystal healing enhancement\n- Post-session guidance and recommendations\n\nReiki works on physical, emotional, mental, and spiritual levels, helping to release blockages and restore balance. Perfect for stress relief, pain management, emotional healing, and overall wellness.",
        basePrice: 80,
        duration: "90 minutes",
        location: "Cusco Wellness Center, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Wellness+Center",
        videoUrl: "https://www.youtube.com/watch?v=9fInAjUA4Hs",
        availableDates: ["Monday-Friday 9am-6pm"],
      },
      {
        title: "Deep Tissue Therapeutic Massage",
        type: "Massage Therapy",
        description: "Professional deep tissue massage targeting chronic muscle tension, pain, and stress. Our certified therapists use specialized techniques to reach deeper layers of muscle and connective tissue.\n\nTreatment benefits:\n- Relief from chronic pain\n- Improved mobility and flexibility\n- Reduced muscle tension\n- Better posture\n- Stress and anxiety reduction\n- Enhanced athletic recovery\n\nIdeal for athletes, people with chronic pain, or anyone seeking deep muscular relief. Can be customized to focus on specific problem areas.",
        basePrice: 70,
        duration: "60 minutes",
        location: "Sacred Valley Spa, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Sacred+Valley+Spa",
        videoUrl: "https://www.youtube.com/watch?v=6v5VahaEL7s",
        availableDates: ["Daily 10am-8pm"],
      },
      {
        title: "Acupuncture & Traditional Chinese Medicine",
        type: "Acupuncture",
        description: "Authentic Traditional Chinese Medicine (TCM) acupuncture treatment by licensed practitioners. This ancient healing art uses fine needles to stimulate specific points, promoting natural healing and balance.\n\nTreatment includes:\n- Comprehensive TCM diagnosis\n- Pulse and tongue analysis\n- Customized acupuncture treatment\n- Cupping therapy (if needed)\n- Herbal medicine recommendations\n- Lifestyle and dietary advice\n\nEffective for pain management, digestive issues, stress, insomnia, hormonal balance, and many other conditions.",
        basePrice: 90,
        duration: "75 minutes",
        location: "Cusco Healing Arts Center, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Healing+Arts",
        videoUrl: "https://www.youtube.com/watch?v=nM-ySWyID9o",
        availableDates: ["Tuesday-Saturday 9am-5pm"],
      },
      {
        title: "Sound Healing Therapy with Crystal Bowls",
        type: "Sound Healing",
        description: "Immersive sound healing session using crystal singing bowls, gongs, and other therapeutic instruments. Sound therapy works at a cellular level, promoting deep relaxation and healing.\n\nSession includes:\n- Guided relaxation and intention setting\n- Crystal bowl sound bath\n- Gong meditation\n- Tibetan bowl therapy\n- Tuning fork treatment\n- Integration time\n\nSound healing helps reduce stress, improve sleep, release emotional blockages, and restore energetic balance. Suitable for all levels, no experience necessary.",
        basePrice: 65,
        duration: "60 minutes",
        location: "Pisac Sound Temple, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Pisac+Sound+Temple",
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
        availableDates: ["Wednesday & Sunday 6pm-7pm"],
      },
      {
        title: "Shamanic Healing & Energy Clearing",
        type: "Shamanic Healing",
        description: "Traditional shamanic healing session combining ancient Andean and Amazonian techniques. Our experienced curanderos (healers) work with energy, spirit, and natural elements to facilitate deep healing.\n\nHealing includes:\n- Energy diagnosis (limpia)\n- Extraction of heavy energies\n- Soul retrieval work\n- Power animal connection\n- Mesa (altar) healing\n- Protection and blessing\n- Integration guidance\n\nEffective for trauma healing, spiritual disconnection, recurring patterns, and energetic imbalances. Deeply transformative work.",
        basePrice: 120,
        duration: "2 hours",
        location: "Sacred Valley, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Sacred+Valley+Healing",
        videoUrl: "https://www.youtube.com/watch?v=kQWAWi-XZqg",
        availableDates: ["By appointment"],
      },
      {
        title: "Breathwork & Pranayama Therapy",
        type: "Breathwork",
        description: "Transformative breathwork session combining various techniques including Holotropic Breathwork, Wim Hof Method, and traditional Pranayama. Breath is a powerful tool for healing and transformation.\n\nSession includes:\n- Breathing technique instruction\n- Guided breathwork journey\n- Somatic release work\n- Integration meditation\n- Personal practice guidance\n\nBreathwork can help release trauma, reduce anxiety, increase energy, improve mental clarity, and facilitate emotional healing. Powerful yet accessible practice.",
        basePrice: 75,
        duration: "90 minutes",
        location: "Cusco Yoga Studio, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Yoga+Studio",
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
        availableDates: ["Monday & Thursday 5pm-6:30pm"],
      },
      {
        title: "Ayurvedic Consultation & Treatment",
        type: "Ayurveda",
        description: "Comprehensive Ayurvedic consultation and treatment plan based on your unique constitution (dosha). Ancient Indian healing system focusing on balance and prevention.\n\nConsultation includes:\n- Detailed health history\n- Dosha assessment (Vata, Pitta, Kapha)\n- Pulse diagnosis\n- Personalized diet plan\n- Herbal recommendations\n- Lifestyle modifications\n- Follow-up support\n\nAyurveda addresses root causes of imbalance, promoting long-term health and vitality through natural methods.",
        basePrice: 100,
        duration: "2 hours",
        location: "Cusco Ayurveda Center, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Ayurveda",
        videoUrl: "https://www.youtube.com/watch?v=wCcLWC72-MQ",
        availableDates: ["Monday-Friday by appointment"],
      },
      {
        title: "Craniosacral Therapy Session",
        type: "Craniosacral Therapy",
        description: "Gentle yet profound craniosacral therapy working with the central nervous system to release tension and promote healing. This subtle bodywork technique is deeply relaxing and therapeutic.\n\nTreatment includes:\n- Initial assessment\n- Gentle cranial work\n- Sacral balancing\n- Fascial release\n- Nervous system regulation\n- Integration time\n\nEffective for headaches, TMJ, stress, trauma, chronic pain, and nervous system disorders. Extremely gentle, suitable for all ages.",
        basePrice: 85,
        duration: "75 minutes",
        location: "Sacred Valley Wellness, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Sacred+Valley+Wellness",
        videoUrl: "https://www.youtube.com/watch?v=9fInAjUA4Hs",
        availableDates: ["Tuesday-Saturday 10am-6pm"],
      },
      {
        title: "Emotional Freedom Technique (EFT) Coaching",
        type: "EFT Tapping",
        description: "Learn and experience Emotional Freedom Technique (EFT), also known as tapping. This evidence-based method combines ancient Chinese acupressure with modern psychology for emotional healing.\n\nSession includes:\n- EFT introduction and theory\n- Identification of core issues\n- Guided tapping sequences\n- Trauma release techniques\n- Self-practice training\n- Take-home protocols\n\nEFT is highly effective for anxiety, phobias, PTSD, limiting beliefs, and emotional blocks. Easy to learn and practice independently.",
        basePrice: 70,
        duration: "60 minutes",
        location: "Cusco Therapy Center, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Therapy+Center",
        videoUrl: "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
        availableDates: ["Monday-Friday 9am-7pm"],
      },
      {
        title: "Reflexology Foot Massage Therapy",
        type: "Reflexology",
        description: "Therapeutic reflexology session working with reflex points on the feet that correspond to organs and systems throughout the body. This ancient healing art promotes overall wellness.\n\nTreatment includes:\n- Foot assessment\n- Full reflexology treatment\n- Pressure point therapy\n- Lymphatic drainage\n- Relaxation techniques\n- Self-care recommendations\n\nReflexology improves circulation, reduces stress, supports detoxification, and promotes natural healing. Deeply relaxing and therapeutic.",
        basePrice: 60,
        duration: "60 minutes",
        location: "Pisac Wellness Spa, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Pisac+Wellness",
        videoUrl: "https://www.youtube.com/watch?v=6v5VahaEL7s",
        availableDates: ["Daily 11am-7pm"],
      },
      {
        title: "Hypnotherapy & Past Life Regression",
        type: "Hypnotherapy",
        description: "Professional hypnotherapy session for deep subconscious healing and transformation. Includes option for past life regression exploration for those interested in deeper spiritual work.\n\nSession includes:\n- Pre-session consultation\n- Guided hypnotic induction\n- Therapeutic suggestions\n- Past life regression (optional)\n- Integration and discussion\n- Self-hypnosis training\n\nEffective for breaking habits, overcoming fears, healing trauma, and accessing deeper wisdom. Safe, professional, and transformative.",
        basePrice: 110,
        duration: "2 hours",
        location: "Cusco Hypnotherapy Clinic, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Hypnotherapy",
        videoUrl: "https://www.youtube.com/watch?v=nM-ySWyID9o",
        availableDates: ["By appointment only"],
      },
      {
        title: "Aromatherapy & Essential Oil Consultation",
        type: "Aromatherapy",
        description: "Personalized aromatherapy consultation and treatment using pure therapeutic-grade essential oils. Learn to harness the healing power of plants through scent and topical application.\n\nConsultation includes:\n- Health and wellness assessment\n- Custom essential oil blend creation\n- Aromatherapy massage\n- Diffuser therapy\n- Take-home blend\n- Usage instructions and safety guidelines\n\nAromatherapy supports emotional balance, immune function, pain relief, and overall wellness. Natural and effective healing.",
        basePrice: 75,
        duration: "90 minutes",
        location: "Sacred Valley Aromatherapy, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Sacred+Valley+Aromatherapy",
        videoUrl: "https://www.youtube.com/watch?v=wCcLWC72-MQ",
        availableDates: ["Wednesday-Sunday 10am-6pm"],
      },
      {
        title: "Chakra Balancing & Energy Alignment",
        type: "Energy Healing",
        description: "Comprehensive chakra balancing session to align and harmonize your energy centers. This treatment combines multiple modalities for deep energetic healing and balance.\n\nSession includes:\n- Chakra assessment and reading\n- Energy clearing and cleansing\n- Chakra balancing with crystals\n- Sound healing for each chakra\n- Aura cleansing\n- Grounding and protection\n- Personalized recommendations\n\nLeave feeling balanced, centered, and energized. Perfect for those feeling blocked, stuck, or energetically depleted.",
        basePrice: 85,
        duration: "90 minutes",
        location: "Cusco Energy Center, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Energy+Center",
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
        availableDates: ["Tuesday-Saturday 9am-5pm"],
      },
      {
        title: "Somatic Experiencing Trauma Therapy",
        type: "Somatic Therapy",
        description: "Gentle trauma healing through Somatic Experiencing (SE), a body-based approach to resolving trauma and stress. This method works with the nervous system to release stored trauma.\n\nTherapy includes:\n- Trauma assessment\n- Body awareness practices\n- Gentle somatic techniques\n- Nervous system regulation\n- Resource building\n- Integration support\n- Home practice guidance\n\nSomatic Experiencing is highly effective for PTSD, anxiety, chronic stress, and developmental trauma. Safe, gentle, and transformative approach.",
        basePrice: 95,
        duration: "75 minutes",
        location: "Cusco Trauma Therapy Center, Peru",
        googleMapsUrl: "https://maps.google.com/?q=Cusco+Trauma+Center",
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
        availableDates: ["Monday-Friday by appointment"],
      },
    ];

    // ========== MICRODOSING (14) ==========
    const microdosing = [
      {
        title: "Psilocybin Microdose Protocol - 30 Day Program",
        type: "Psilocybin",
        description: "Complete 30-day psilocybin microdosing protocol designed to enhance creativity, focus, and emotional well-being. Includes consultation, dosing schedule, and integration support.\n\nProgram includes:\n- Initial consultation and assessment\n- 30-day supply of precisely dosed capsules\n- Personalized dosing schedule\n- Weekly check-ins\n- Integration journal\n- Final evaluation session\n\nMicrodosing psilocybin can help with depression, anxiety, PTSD, creativity blocks, and overall life enhancement. Safe, legal, and effective approach.",
        basePrice: 180,
        duration: "30 days",
        inventory: 50,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Wellness Center" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "LSD Microdose Kit - Enhanced Cognition",
        type: "LSD",
        description: "Premium LSD microdosing kit for cognitive enhancement, creativity, and mental clarity. Pharmaceutical-grade quality with precise dosing.\n\nKit contains:\n- 20 microdose units (10μg each)\n- Dosing guide and schedule\n- Integration workbook\n- Access to online support group\n- Storage container\n\nLSD microdosing is known for enhancing problem-solving, pattern recognition, and creative thinking. Popular among professionals and creatives.",
        basePrice: 150,
        duration: "20 days",
        inventory: 30,
        shippingOptions: { envio: true, recojo: true, address: "Lima Distribution Center" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Ayahuasca Microdose - Spirit Connection",
        type: "Ayahuasca",
        description: "Gentle Ayahuasca microdosing for spiritual connection and emotional healing without the intensity of full ceremony. Perfect for daily spiritual practice.\n\nIncludes:\n- 30 microdose capsules\n- Preparation guide\n- Meditation practices\n- Integration support\n- Dietary recommendations\n\nAyahuasca microdosing offers gentle heart opening, emotional processing, and spiritual insights suitable for daily life.",
        basePrice: 120,
        duration: "30 days",
        inventory: 40,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Center" },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Lion's Mane & Psilocybin Stack - Cognitive Boost",
        type: "Psilocybin Stack",
        description: "Synergistic combination of psilocybin microdose with Lion's Mane mushroom for enhanced neurogenesis and cognitive function.\n\nStack benefits:\n- Enhanced memory and focus\n- Neuroplasticity support\n- Mood elevation\n- Cognitive clarity\n- Neuroprotection\n\n60 capsules (30-day supply) with optimal ratios of both mushrooms. Popular among students and professionals.",
        basePrice: 140,
        duration: "30 days",
        inventory: 60,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Distribution" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "San Pedro Microdose - Heart Medicine",
        type: "San Pedro",
        description: "Gentle San Pedro (mescaline) microdosing for heart opening, emotional healing, and connection with nature. Traditional Andean medicine in modern format.\n\nProgram includes:\n- 20 microdose capsules\n- Heart-centered practices\n- Nature connection exercises\n- Integration guidance\n- Community support access\n\nSan Pedro microdosing promotes compassion, emotional balance, and spiritual growth.",
        basePrice: 130,
        duration: "20 days",
        inventory: 35,
        shippingOptions: { envio: true, recojo: true, address: "Sacred Valley Center" },
        videoUrl: "https://www.youtube.com/watch?v=YVg6CtmVOr0",
      },
      {
        title: "DMT Microdose - Consciousness Expansion",
        type: "DMT",
        description: "Carefully prepared DMT microdosing protocol for consciousness expansion and spiritual exploration. Sub-perceptual doses for daily practice.\n\nKit includes:\n- 15 microdose units\n- Meditation guide\n- Breathwork practices\n- Integration journal\n- Safety protocols\n\nDMT microdosing offers subtle shifts in consciousness, enhanced intuition, and spiritual insights.",
        basePrice: 160,
        duration: "15 days",
        inventory: 25,
        shippingOptions: { envio: true, recojo: true, address: "Lima Secure Facility" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Psilocybin Truffles Microdose - Natural Form",
        type: "Psilocybin Truffles",
        description: "Fresh psilocybin truffles in microdose portions. Natural, unprocessed form of psilocybin for those preferring whole plant medicine.\n\nPackage includes:\n- 30 fresh truffle portions\n- Storage instructions\n- Dosing guide\n- Recipe suggestions\n- Integration tips\n\nTruffles offer a gentler, more natural microdosing experience with full spectrum of compounds.",
        basePrice: 110,
        duration: "30 days",
        inventory: 45,
        shippingOptions: { recojo: true, address: "Cusco Fresh Market" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Iboga Microdose - Addiction Support",
        type: "Iboga",
        description: "Iboga microdosing protocol specifically designed for addiction recovery and breaking unwanted patterns. Gentle alternative to full flood dose.\n\nProgram includes:\n- 30-day microdose supply\n- Addiction recovery workbook\n- Weekly support calls\n- Nutrition guide\n- Relapse prevention strategies\n\nIboga microdosing supports addiction recovery, pattern breaking, and personal transformation.",
        basePrice: 200,
        duration: "30 days",
        inventory: 20,
        shippingOptions: { envio: true, recojo: true, address: "Lima Therapy Center" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Psilocybin + Niacin + Lion's Mane - Stamets Stack",
        type: "Stamets Stack",
        description: "The famous Paul Stamets neurogenesis stack combining psilocybin, niacin, and Lion's Mane for optimal brain health and cognitive enhancement.\n\nStack benefits:\n- Neurogenesis promotion\n- Enhanced neuroplasticity\n- Improved memory\n- Mood regulation\n- Cognitive longevity\n\n90 capsules (30-day supply) following Stamets' recommended protocol.",
        basePrice: 160,
        duration: "30 days",
        inventory: 55,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Wellness" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Mescaline Microdose - Desert Wisdom",
        type: "Mescaline",
        description: "Pure mescaline microdosing for spiritual growth, creativity, and emotional healing. Extracted from sacred cacti with traditional methods.\n\nKit includes:\n- 20 precise microdoses\n- Desert meditation practices\n- Creative exercises\n- Integration support\n- Safety guidelines\n\nMescaline microdosing offers gentle heart opening and enhanced sensory perception.",
        basePrice: 145,
        duration: "20 days",
        inventory: 30,
        shippingOptions: { envio: true, recojo: true, address: "Arequipa Center" },
        videoUrl: "https://www.youtube.com/watch?v=YVg6CtmVOr0",
      },
      {
        title: "Psilocybin Microdose for Depression - Clinical Protocol",
        type: "Psilocybin Clinical",
        description: "Evidence-based psilocybin microdosing protocol specifically designed for depression management. Based on latest research and clinical trials.\n\nProgram includes:\n- Initial mental health assessment\n- 60-day supply (2 months)\n- Bi-weekly therapy sessions\n- Mood tracking app\n- Crisis support line\n- Final evaluation\n\nClinically-informed approach to depression treatment with professional support.",
        basePrice: 250,
        duration: "60 days",
        inventory: 25,
        shippingOptions: { envio: true, recojo: true, address: "Lima Mental Health Clinic" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Ayahuasca + Bobinsana Microdose - Heart Healing",
        type: "Ayahuasca Blend",
        description: "Synergistic blend of Ayahuasca and Bobinsana (heart-healing plant) for emotional healing and opening to love.\n\nBlend benefits:\n- Heart chakra healing\n- Emotional release\n- Increased compassion\n- Relationship healing\n- Self-love cultivation\n\n30 capsules with heart-centered practices and guided meditations.",
        basePrice: 135,
        duration: "30 days",
        inventory: 40,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Healing Center" },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Psilocybin Microdose for PTSD - Trauma Protocol",
        type: "Psilocybin PTSD",
        description: "Specialized psilocybin microdosing protocol for PTSD and trauma recovery. Gentle, trauma-informed approach with professional support.\n\nProtocol includes:\n- Trauma assessment\n- 45-day microdose supply\n- Weekly trauma therapy\n- Somatic practices\n- Safety planning\n- Integration support\n\nDesigned specifically for trauma survivors with emphasis on safety and gradual healing.",
        basePrice: 220,
        duration: "45 days",
        inventory: 20,
        shippingOptions: { envio: true, recojo: true, address: "Lima Trauma Center" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
      {
        title: "Psilocybin + CBD Microdose - Anxiety Relief",
        type: "Psilocybin CBD",
        description: "Calming combination of psilocybin microdose with CBD for anxiety management and stress relief.\n\nCombination benefits:\n- Reduced anxiety\n- Stress management\n- Mood stabilization\n- Better sleep\n- Emotional balance\n\n60 capsules (30-day supply) with anxiety management techniques and breathing exercises.",
        basePrice: 155,
        duration: "30 days",
        inventory: 50,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Wellness Center" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
    ];

    // ========== MEDICINE (14) ==========
    const medicine = [
      {
        title: "Sacred Rapé - Amazonian Tobacco Snuff",
        type: "Rapé",
        description: "Authentic Amazonian Rapé (sacred tobacco snuff) from the Huni Kuin tribe. Used for grounding, clarity, and spiritual connection.\n\nProduct details:\n- 10g of pure Rapé\n- Traditional blend with medicinal ashes\n- Includes applicator (Kuripe)\n- Usage instructions\n- Storage container\n\nRapé clears mental fog, grounds energy, and facilitates meditation. Powerful shamanic tool.",
        basePrice: 40,
        inventory: 100,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Shop" },
        specificFields: { 
          components: ["Sacred tobacco", "Medicinal tree ashes", "Mint", "Cinnamon"],
          benefits: ["Mental clarity", "Grounding", "Spiritual connection", "Energy cleansing"]
        },
        videoUrl: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
      },
      {
        title: "Sananga Eye Drops - Vision Medicine",
        type: "Sananga",
        description: "Traditional Amazonian Sananga eye drops for physical and spiritual vision enhancement. Made from Tabernaemontana undulata root.\n\nBenefits:\n- Improved physical vision\n- Enhanced spiritual sight\n- Energy clearing\n- Headache relief\n- Eye health support\n\n10ml bottle with dropper. Intense but brief burning sensation followed by clarity.",
        basePrice: 35,
        inventory: 80,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Center" },
        specificFields: {
          components: ["Tabernaemontana undulata root", "Distilled water"],
          benefits: ["Vision enhancement", "Spiritual sight", "Eye health", "Energy clearing"]
        },
        videoUrl: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
      },
      {
        title: "Palo Santo Sticks - Sacred Wood",
        type: "Palo Santo",
        description: "Premium Palo Santo (Holy Wood) from sustainably harvested fallen trees in Ecuador. Used for cleansing, protection, and raising vibration.\n\nPackage includes:\n- 10 thick Palo Santo sticks\n- Ceramic holder\n- Usage guide\n- Blessing ritual\n\nPalo Santo clears negative energy, promotes relaxation, and creates sacred space. Essential for any spiritual practice.",
        basePrice: 25,
        inventory: 150,
        shippingOptions: { envio: true, recojo: true, address: "Lima Distribution" },
        specificFields: {
          components: ["Pure Palo Santo wood"],
          benefits: ["Energy cleansing", "Relaxation", "Protection", "Sacred space creation"]
        },
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
      },
      {
        title: "Dragon's Blood Resin - Amazonian Healing",
        type: "Dragon's Blood",
        description: "Pure Dragon's Blood resin (Sangre de Drago) from the Amazon. Powerful healing medicine for wounds, inflammation, and protection.\n\nUses:\n- Wound healing\n- Skin conditions\n- Digestive support\n- Immune boost\n- Spiritual protection\n\n30ml bottle of pure resin. Can be used topically or internally (diluted).",
        basePrice: 30,
        inventory: 90,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Pharmacy" },
        specificFields: {
          components: ["Croton lechleri resin"],
          benefits: ["Wound healing", "Anti-inflammatory", "Immune support", "Protection"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Copal Resin - Mayan Sacred Incense",
        type: "Copal",
        description: "Authentic Mayan Copal resin for ceremony, meditation, and space clearing. Used for thousands of years in Mesoamerican rituals.\n\nPackage includes:\n- 100g pure Copal resin\n- Charcoal discs\n- Incense burner\n- Ceremonial guide\n\nCopal purifies energy, facilitates meditation, and connects with ancient wisdom. Sweet, uplifting aroma.",
        basePrice: 28,
        inventory: 120,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Shop" },
        specificFields: {
          components: ["Pure Copal resin"],
          benefits: ["Purification", "Meditation support", "Ancestral connection", "Uplifting energy"]
        },
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
      },
      {
        title: "Bobinsana Tincture - Heart Medicine",
        type: "Bobinsana",
        description: "Potent Bobinsana (Calliandra angustifolia) tincture for heart healing and emotional opening. Traditional Amazonian love medicine.\n\nBenefits:\n- Heart chakra opening\n- Emotional healing\n- Dream enhancement\n- Arthritis relief\n- Increased compassion\n\n50ml alcohol-based tincture. Take 20 drops twice daily.",
        basePrice: 45,
        inventory: 70,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Herbalist" },
        specificFields: {
          components: ["Bobinsana bark", "Organic alcohol"],
          benefits: ["Heart healing", "Emotional opening", "Dream work", "Anti-inflammatory"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Chuchuhuasi Bark - Amazonian Strength",
        type: "Chuchuhuasi",
        description: "Traditional Chuchuhuasi bark medicine for strength, vitality, and pain relief. Known as the 'trembling tree' for its powerful effects.\n\nUses:\n- Joint and muscle pain\n- Arthritis relief\n- Energy boost\n- Immune support\n- Aphrodisiac properties\n\n100g dried bark for tea or tincture making. Includes preparation instructions.",
        basePrice: 35,
        inventory: 85,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Market" },
        specificFields: {
          components: ["Chuchuhuasi bark"],
          benefits: ["Pain relief", "Energy boost", "Immune support", "Vitality"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Ayahuasca Vine - Banisteriopsis Caapi",
        type: "Ayahuasca Vine",
        description: "Pure Ayahuasca vine (Banisteriopsis caapi) for brewing your own medicine or microdosing. Sustainably harvested from the Amazon.\n\nProduct details:\n- 100g shredded vine\n- Brewing instructions\n- Dosage guidelines\n- Safety information\n\nThe vine alone (without DMT source) is legal and offers healing benefits including MAO inhibition and spiritual connection.",
        basePrice: 50,
        inventory: 60,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Center" },
        specificFields: {
          components: ["Banisteriopsis caapi vine"],
          benefits: ["Spiritual connection", "Dream enhancement", "Healing", "Consciousness expansion"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Chacruna Leaves - Psychotria Viridis",
        type: "Chacruna",
        description: "Dried Chacruna leaves (Psychotria viridis), the DMT-containing component of Ayahuasca. For experienced practitioners only.\n\nProduct details:\n- 50g dried leaves\n- Preparation guide\n- Safety protocols\n- Legal information\n\nMust be combined with MAO inhibitor. For ceremonial use only.",
        basePrice: 40,
        inventory: 50,
        shippingOptions: { recojo: true, address: "Iquitos Secure Location" },
        specificFields: {
          components: ["Psychotria viridis leaves"],
          benefits: ["Visionary experiences", "Spiritual insights", "Healing", "Consciousness expansion"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Mapacho - Sacred Tobacco",
        type: "Mapacho",
        description: "Pure Amazonian Mapacho (Nicotiana rustica) tobacco for ceremony and healing. Much stronger than commercial tobacco.\n\nUses:\n- Ceremonial smoking\n- Rapé preparation\n- Energy clearing\n- Spiritual protection\n- Offering to spirits\n\n50g dried leaves. Can be smoked, made into Rapé, or used in ceremony.",
        basePrice: 30,
        inventory: 95,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Shop" },
        specificFields: {
          components: ["Nicotiana rustica leaves"],
          benefits: ["Grounding", "Protection", "Clarity", "Spiritual connection"]
        },
        videoUrl: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
      },
      {
        title: "Kambo Sticks - Frog Medicine",
        type: "Kambo",
        description: "Authentic Kambo sticks from the giant monkey frog (Phyllomedusa bicolor). For experienced practitioners or with trained facilitator.\n\nProduct includes:\n- 1 Kambo stick (multiple applications)\n- Application instructions\n- Safety protocols\n- Preparation guide\n\nKambo is powerful detox medicine. Proper training recommended before self-application.",
        basePrice: 60,
        inventory: 40,
        shippingOptions: { recojo: true, address: "Iquitos Practitioner Office" },
        specificFields: {
          components: ["Phyllomedusa bicolor secretion"],
          benefits: ["Detoxification", "Immune boost", "Mental clarity", "Energy increase"]
        },
        videoUrl: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
      },
      {
        title: "Ajo Sacha Tincture - Garlic of the Forest",
        type: "Ajo Sacha",
        description: "Ajo Sacha (Mansoa alliacea) tincture for strength, protection, and healing. Known as 'garlic of the forest' for its powerful properties.\n\nBenefits:\n- Immune system boost\n- Anti-inflammatory\n- Pain relief\n- Energy increase\n- Spiritual protection\n\n50ml tincture. Take 15-20 drops twice daily.",
        basePrice: 38,
        inventory: 75,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Herbalist" },
        specificFields: {
          components: ["Mansoa alliacea", "Organic alcohol"],
          benefits: ["Immune support", "Pain relief", "Energy", "Protection"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Uña de Gato - Cat's Claw",
        type: "Cat's Claw",
        description: "Premium Cat's Claw (Uncaria tomentosa) from the Peruvian Amazon. Powerful immune booster and anti-inflammatory.\n\nHealth benefits:\n- Immune system support\n- Anti-inflammatory\n- Antioxidant properties\n- Digestive health\n- Joint support\n\n100g powdered bark. Can be made into tea or taken in capsules.",
        basePrice: 32,
        inventory: 110,
        shippingOptions: { envio: true, recojo: true, address: "Lima Health Store" },
        specificFields: {
          components: ["Uncaria tomentosa bark"],
          benefits: ["Immune boost", "Anti-inflammatory", "Antioxidant", "Digestive support"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
      {
        title: "Guayusa Tea - Amazonian Energy",
        type: "Guayusa",
        description: "Organic Guayusa (Ilex guayusa) tea from Ecuador. Natural caffeine source with lucid dreaming properties.\n\nBenefits:\n- Clean energy (no jitters)\n- Mental clarity\n- Lucid dreaming\n- Antioxidants\n- Digestive support\n\n200g loose leaf tea. Traditional drink of Amazonian shamans.",
        basePrice: 25,
        inventory: 130,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Tea Shop" },
        specificFields: {
          components: ["Ilex guayusa leaves"],
          benefits: ["Energy", "Mental clarity", "Dream enhancement", "Antioxidants"]
        },
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
      },
    ];

    // ========== EVENTS (14) ==========
    const events = [
      {
        title: "Full Moon Ceremony & Cacao Circle",
        type: "Full Moon Ceremony",
        description: "Magical full moon ceremony combining cacao, sound healing, and lunar rituals. Celebrate the peak of lunar energy with community.\n\nEvent includes:\n- Opening circle and intentions\n- Ceremonial cacao drinking\n- Sound healing journey\n- Moon meditation\n- Fire ceremony\n- Closing integration\n\nConnect with lunar energy, release what no longer serves, and manifest your intentions.",
        basePrice: 45,
        duration: "4 hours",
        location: "Sacred Valley Amphitheater, Peru",
        videoUrl: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
        availableDates: ["2025-11-15", "2025-12-15", "2026-01-13"],
        specificFields: {
          artists: ["Luna Sound Collective", "Cacao Shaman Maria"],
          capacity: 50
        },
      },
      {
        title: "Psychedelic Integration Workshop - 2 Days",
        type: "Workshop",
        description: "Comprehensive 2-day workshop for integrating psychedelic experiences into daily life. Learn tools and practices for lasting transformation.\n\nWorkshop covers:\n- Integration theory and practice\n- Journaling techniques\n- Somatic practices\n- Community sharing\n- Action planning\n- Ongoing support\n\nPerfect for anyone who has had psychedelic experiences and wants to deepen the integration.",
        basePrice: 150,
        duration: "2 days",
        location: "Cusco Integration Center, Peru",
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
        availableDates: ["2025-11-20-21", "2025-12-10-11", "2026-01-15-16"],
        specificFields: {
          artists: ["Dr. Sarah Thompson", "Integration Coach Miguel"],
          capacity: 30
        },
      },
      {
        title: "Sacred Music Festival - 3 Days",
        type: "Music Festival",
        description: "Three-day festival celebrating sacred music, plant medicine culture, and conscious community. Music, workshops, ceremonies, and connection.\n\nFestival features:\n- 20+ musical acts\n- Cacao ceremonies\n- Workshops and talks\n- Healing village\n- Camping included\n- Vegetarian meals\n\nImmerse yourself in transformational music and community in the Sacred Valley.",
        basePrice: 200,
        duration: "3 days",
        location: "Sacred Valley Festival Grounds, Peru",
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
        availableDates: ["2025-12-05-07", "2026-02-15-17"],
        specificFields: {
          artists: ["Medicine Music Collective", "Tribal Fusion Band", "Sacred Sound Orchestra"],
          capacity: 500
        },
      },
      {
        title: "Breathwork & Ice Bath Experience",
        type: "Breathwork Event",
        description: "Powerful combination of Wim Hof breathwork and ice bath immersion. Push your limits and discover your inner strength.\n\nExperience includes:\n- Wim Hof breathing technique\n- Guided breathwork journey\n- Ice bath immersion\n- Sauna session\n- Integration circle\n- Hot soup and tea\n\nTransformative practice for building resilience, reducing stress, and boosting immunity.",
        basePrice: 60,
        duration: "3 hours",
        location: "Cusco Wellness Retreat, Peru",
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
        availableDates: ["Every Saturday 8am-11am"],
        specificFields: {
          artists: ["Wim Hof Instructor Carlos"],
          capacity: 20
        },
      },
      {
        title: "Women's Healing Retreat - 5 Days",
        type: "Women's Retreat",
        description: "Transformative 5-day retreat exclusively for women. Combine ceremony, sisterhood, and healing practices in sacred space.\n\nRetreat includes:\n- 2 cacao ceremonies\n- Daily yoga and meditation\n- Womb healing workshops\n- Sound healing\n- Nature walks\n- Sharing circles\n- All meals and accommodation\n\nReconnect with your feminine essence and heal in the company of sisters.",
        basePrice: 800,
        duration: "5 days",
        location: "Sacred Valley Women's Center, Peru",
        videoUrl: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
        availableDates: ["2025-11-25-29", "2026-01-20-24"],
        specificFields: {
          artists: ["Women's Circle Leader Ana", "Yoga Teacher Sofia"],
          capacity: 16
        },
      },
      {
        title: "Plant Medicine Conference - 3 Days",
        type: "Conference",
        description: "International conference bringing together researchers, practitioners, and enthusiasts of plant medicine. Learn from leading experts.\n\nConference features:\n- 30+ presentations\n- Panel discussions\n- Networking events\n- Vendor marketplace\n- Evening ceremonies\n- Certificate of attendance\n\nStay current with latest research and connect with the global plant medicine community.",
        basePrice: 300,
        duration: "3 days",
        location: "Lima Convention Center, Peru",
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
        availableDates: ["2026-03-15-17"],
        specificFields: {
          artists: ["Dr. Rick Strassman", "Dennis McKenna", "Dr. Gabor Maté"],
          capacity: 1000
        },
      },
      {
        title: "Ecstatic Dance Journey",
        type: "Ecstatic Dance",
        description: "Weekly ecstatic dance journey for free movement, expression, and connection. No talking, no phones, just pure movement meditation.\n\nEvent includes:\n- Opening circle\n- 2-hour DJ set\n- Movement facilitation\n- Closing meditation\n- Tea and snacks\n\nDance your prayers, release stuck energy, and connect with your body and community.",
        basePrice: 20,
        duration: "3 hours",
        location: "Cusco Dance Temple, Peru",
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
        availableDates: ["Every Friday 7pm-10pm"],
        specificFields: {
          artists: ["DJ Cosmic Flow", "Movement Facilitator Luna"],
          capacity: 80
        },
      },
      {
        title: "Shamanic Drumming Circle",
        type: "Drumming Circle",
        description: "Traditional shamanic drumming circle for journey work, healing, and community. Bring your drum or use ours.\n\nCircle includes:\n- Opening ceremony\n- Shamanic journey with drumming\n- Sharing circle\n- Closing blessing\n\nConnect with ancient rhythms and journey to non-ordinary reality for healing and guidance.",
        basePrice: 25,
        duration: "2.5 hours",
        location: "Sacred Valley Community Center, Peru",
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
        availableDates: ["Every New Moon"],
        specificFields: {
          artists: ["Shamanic Practitioner Marco"],
          capacity: 40
        },
      },
      {
        title: "Yoga & Meditation Immersion - 7 Days",
        type: "Yoga Retreat",
        description: "Week-long yoga and meditation immersion in the Sacred Valley. Deepen your practice and find inner peace.\n\nImmersion includes:\n- Daily yoga classes (2x)\n- Meditation sessions\n- Pranayama practice\n- Philosophy talks\n- Silent meditation day\n- All meals (vegetarian)\n- Accommodation\n\nTransform your practice and life in this intensive week of yoga and meditation.",
        basePrice: 900,
        duration: "7 days",
        location: "Sacred Valley Yoga Retreat, Peru",
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
        availableDates: ["2025-12-01-07", "2026-01-10-16", "2026-02-05-11"],
        specificFields: {
          artists: ["Yoga Master Ravi", "Meditation Teacher Deepa"],
          capacity: 25
        },
      },
      {
        title: "Conscious Business Summit",
        type: "Business Summit",
        description: "Summit for entrepreneurs and leaders integrating consciousness and plant medicine wisdom into business. Network and learn.\n\nSummit includes:\n- Keynote presentations\n- Breakout sessions\n- Networking events\n- Cacao ceremony\n- Business plan workshop\n- Ongoing community access\n\nBuild a business aligned with your values and the greater good.",
        basePrice: 250,
        duration: "2 days",
        location: "Cusco Business Center, Peru",
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
        availableDates: ["2026-02-20-21"],
        specificFields: {
          artists: ["Business Coach Maria", "Entrepreneur Panel"],
          capacity: 100
        },
      },
      {
        title: "Sacred Geometry Workshop",
        type: "Art Workshop",
        description: "Hands-on workshop exploring sacred geometry through art, meditation, and mathematics. Create your own sacred art.\n\nWorkshop includes:\n- Sacred geometry theory\n- Drawing techniques\n- Meditation practices\n- Art supplies included\n- Take home your creations\n\nDiscover the mathematical patterns underlying creation and express them through art.",
        basePrice: 80,
        duration: "1 day",
        location: "Cusco Art Studio, Peru",
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
        availableDates: ["2025-11-18", "2025-12-09", "2026-01-20"],
        specificFields: {
          artists: ["Sacred Geometry Artist David"],
          capacity: 20
        },
      },
      {
        title: "Tantra & Sacred Sexuality Retreat - 4 Days",
        type: "Tantra Retreat",
        description: "Transformative tantra retreat for singles and couples. Explore sacred sexuality, intimacy, and conscious relating.\n\nRetreat includes:\n- Tantra teachings\n- Partner exercises\n- Breathwork practices\n- Cacao ceremony\n- Ecstatic dance\n- Private sessions available\n- All meals and accommodation\n\nDeepen intimacy, heal sexual wounds, and awaken your sacred sexuality.",
        basePrice: 600,
        duration: "4 days",
        location: "Sacred Valley Tantra Center, Peru",
        videoUrl: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
        availableDates: ["2025-12-12-15", "2026-02-14-17"],
        specificFields: {
          artists: ["Tantra Teachers Shakti & Shiva"],
          capacity: 30
        },
      },
      {
        title: "Permaculture & Plant Medicine Workshop",
        type: "Permaculture Workshop",
        description: "Learn to grow your own plant medicines using permaculture principles. Hands-on workshop at organic farm.\n\nWorkshop covers:\n- Permaculture basics\n- Growing sacred plants\n- Sustainable practices\n- Plant identification\n- Harvesting techniques\n- Preparation methods\n\nLeave with knowledge and seeds to start your own medicine garden.",
        basePrice: 120,
        duration: "2 days",
        location: "Sacred Valley Permaculture Farm, Peru",
        videoUrl: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
        availableDates: ["2025-11-22-23", "2025-12-20-21"],
        specificFields: {
          artists: ["Permaculture Designer Juan", "Ethnobotanist Maria"],
          capacity: 25
        },
      },
      {
        title: "Sound Healing Training - Certification Course",
        type: "Training Course",
        description: "Comprehensive 10-day sound healing practitioner training. Learn to facilitate sound healing sessions professionally.\n\nTraining includes:\n- Sound healing theory\n- Instrument techniques\n- Session design\n- Ethics and safety\n- Practice sessions\n- Business guidance\n- Certification\n\nBecome a certified sound healing practitioner and share this powerful modality.",
        basePrice: 1200,
        duration: "10 days",
        location: "Cusco Sound Healing Academy, Peru",
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
        availableDates: ["2026-01-10-19", "2026-03-05-14"],
        specificFields: {
          artists: ["Sound Healing Master Teacher Jonathan"],
          capacity: 15
        },
      },
    ];

    // ========== PRODUCTS (14) ==========
    const products = [
      {
        title: "Handcrafted Shamanic Drum - Buffalo Hide",
        type: "Musical Instrument",
        description: "Beautiful handcrafted shamanic drum made with buffalo hide and sacred wood. Perfect for ceremony, meditation, and shamanic journeying.\n\nDrum features:\n- 16-inch diameter\n- Buffalo hide head\n- Wooden frame from sacred tree\n- Hand-painted sacred symbols\n- Includes beater\n- Carrying case\n\nEach drum is unique and blessed in ceremony. Powerful tool for shamanic practice.",
        basePrice: 180,
        inventory: 15,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Artisan Workshop" },
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
      },
      {
        title: "Crystal Singing Bowl - 432Hz Tuned",
        type: "Sound Healing Tool",
        description: "Pure quartz crystal singing bowl tuned to 432Hz, the frequency of universal harmony. Produces powerful healing tones.\n\nBowl specifications:\n- 10-inch diameter\n- Pure quartz crystal\n- 432Hz tuning (Heart chakra)\n- Includes striker and cushion\n- Carrying case\n\nCrystal bowls are powerful tools for meditation, healing, and ceremony.",
        basePrice: 250,
        inventory: 10,
        shippingOptions: { envio: true, recojo: true, address: "Lima Sound Shop" },
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
      },
      {
        title: "Sacred Geometry Wall Art - Flower of Life",
        type: "Artwork",
        description: "Stunning Flower of Life sacred geometry art piece. Hand-painted on wood with natural pigments and gold leaf.\n\nArt piece details:\n- 24-inch diameter\n- Hand-painted on wood\n- Natural pigments and gold leaf\n- Ready to hang\n- Certificate of authenticity\n\nThe Flower of Life represents creation and universal consciousness. Beautiful and powerful.",
        basePrice: 200,
        inventory: 8,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Art Gallery" },
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
      },
      {
        title: "Meditation Cushion Set - Organic Cotton",
        type: "Meditation Supplies",
        description: "Premium meditation cushion set made with organic cotton and buckwheat hulls. Perfect support for long meditation sessions.\n\nSet includes:\n- Zafu (round cushion)\n- Zabuton (mat)\n- Organic cotton cover\n- Buckwheat hull filling\n- Carrying handle\n- Washable covers\n\nProper support for comfortable, aligned meditation practice.",
        basePrice: 90,
        inventory: 30,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Yoga Shop" },
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      },
      {
        title: "Tibetan Singing Bowl Set - 7 Chakras",
        type: "Sound Healing Tool",
        description: "Complete set of 7 Tibetan singing bowls, one for each chakra. Hand-hammered in Nepal by traditional artisans.\n\nSet includes:\n- 7 singing bowls (chakra tuned)\n- 7 strikers\n- 7 cushions\n- Wooden display stand\n- Carrying case\n- Usage guide\n\nPerfect for chakra balancing, sound healing, and meditation practice.",
        basePrice: 400,
        inventory: 5,
        shippingOptions: { envio: true, recojo: true, address: "Lima Imports" },
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
      },
      {
        title: "Handwoven Alpaca Meditation Blanket",
        type: "Textile",
        description: "Luxurious meditation blanket handwoven from 100% baby alpaca wool. Traditional Andean patterns and natural dyes.\n\nBlanket features:\n- 100% baby alpaca wool\n- 60\" x 80\" size\n- Traditional Andean design\n- Natural plant dyes\n- Handwoven by artisans\n\nSoft, warm, and beautiful. Perfect for meditation, ceremony, or home decor.",
        basePrice: 150,
        inventory: 20,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Textile Cooperative" },
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
      },
      {
        title: "Ceremonial Cacao Paste - 1kg Block",
        type: "Ceremonial Cacao",
        description: "Premium ceremonial-grade cacao paste from Peru. 100% pure, organic, and ethically sourced. Perfect for ceremonies and daily practice.\n\nCacao details:\n- 1kg block (20-25 servings)\n- 100% pure cacao\n- Organic and fair trade\n- Ceremonial grade\n- Preparation instructions\n- Recipe booklet\n\nHigh in antioxidants, magnesium, and heart-opening compounds. Sacred plant medicine.",
        basePrice: 60,
        inventory: 50,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Cacao Collective" },
        videoUrl: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
      },
      {
        title: "Sage & Palo Santo Smudge Kit",
        type: "Cleansing Kit",
        description: "Complete smudging kit with white sage, Palo Santo, and abalone shell. Everything needed for space clearing and protection.\n\nKit includes:\n- 3 white sage bundles\n- 5 Palo Santo sticks\n- Abalone shell\n- Feather\n- Sand for shell\n- Usage guide\n\nTraditional tools for energy cleansing and sacred space creation.",
        basePrice: 45,
        inventory: 60,
        shippingOptions: { envio: true, recojo: true, address: "Lima Spiritual Shop" },
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
      },
      {
        title: "Crystal Healing Set - 7 Chakra Stones",
        type: "Crystal Set",
        description: "Complete chakra crystal healing set with 7 tumbled stones, one for each energy center. Includes information cards.\n\nSet includes:\n- Red Jasper (Root)\n- Carnelian (Sacral)\n- Citrine (Solar Plexus)\n- Rose Quartz (Heart)\n- Blue Lace Agate (Throat)\n- Amethyst (Third Eye)\n- Clear Quartz (Crown)\n- Velvet pouch\n- Information cards\n\nPerfect for chakra balancing, meditation, and energy healing.",
        basePrice: 50,
        inventory: 40,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Crystal Shop" },
        videoUrl: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
      },
      {
        title: "Handmade Rapé Applicator Set - Kuripe & Tepi",
        type: "Rapé Tools",
        description: "Beautiful handcrafted Rapé applicator set including both self-applicator (Kuripe) and partner applicator (Tepi).\n\nSet includes:\n- Kuripe (self-applicator)\n- Tepi (partner applicator)\n- Handcrafted from sacred wood\n- Decorated with traditional designs\n- Cleaning brush\n- Storage pouch\n- Usage instructions\n\nEssential tools for Rapé practice. Handmade by indigenous artisans.",
        basePrice: 70,
        inventory: 25,
        shippingOptions: { envio: true, recojo: true, address: "Iquitos Artisan Market" },
        videoUrl: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
      },
      {
        title: "Yoga Mat - Natural Rubber & Cork",
        type: "Yoga Equipment",
        description: "Premium eco-friendly yoga mat made from natural rubber and cork. Non-toxic, sustainable, and provides excellent grip.\n\nMat features:\n- Natural rubber base\n- Cork top surface\n- 72\" x 24\" size\n- 5mm thickness\n- Non-slip texture\n- Carrying strap\n- Eco-friendly\n\nPerfect grip even when sweaty. Sustainable and beautiful.",
        basePrice: 80,
        inventory: 35,
        shippingOptions: { envio: true, recojo: true, address: "Lima Yoga Store" },
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      },
      {
        title: "Mala Beads - 108 Rudraksha Seeds",
        type: "Prayer Beads",
        description: "Traditional mala beads made from 108 Rudraksha seeds. Sacred tool for meditation, mantra practice, and prayer.\n\nMala features:\n- 108 Rudraksha beads\n- Guru bead\n- Silk tassel\n- Hand-knotted\n- Blessed in ceremony\n- Comes in silk pouch\n\nRudraksha seeds are sacred to Shiva and carry powerful spiritual energy.",
        basePrice: 55,
        inventory: 45,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Spiritual Shop" },
        videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      },
      {
        title: "Incense Holder - Handcarved Wood",
        type: "Altar Supplies",
        description: "Beautiful handcarved wooden incense holder with sacred symbols. Holds both stick and cone incense.\n\nHolder features:\n- Handcarved from sacred wood\n- Flower of Life design\n- Holds stick and cone incense\n- Ash catcher\n- 10-inch length\n- Natural finish\n\nFunctional art for your altar or meditation space.",
        basePrice: 35,
        inventory: 50,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Woodworker" },
        videoUrl: "https://www.youtube.com/watch?v=xLb9jPym-OM",
      },
      {
        title: "Plant Medicine Journal - Handmade Paper",
        type: "Journal",
        description: "Beautiful handmade journal for documenting your plant medicine journey. Made with recycled paper and traditional binding.\n\nJournal features:\n- 200 pages handmade paper\n- Leather cover\n- Traditional binding\n- Ribbon bookmark\n- 8\" x 10\" size\n- Includes prompts and guides\n\nDocument your ceremonies, integration, and spiritual growth.",
        basePrice: 40,
        inventory: 30,
        shippingOptions: { envio: true, recojo: true, address: "Cusco Bookbinder" },
        videoUrl: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
      },
    ];

    console.log("✅ Seed data prepared. Creating listings...");
    
    let created = 0;
    
    // Create ceremonies
    for (const ceremony of ceremonies) {
      const prices = calculatePrices(ceremony.basePrice);
      await db.insert(therapies).values({
        id: randomUUID(),
        guideId: guide.id,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        category: "ceremonias",
        title: ceremony.title,
        slug: generateSlug(ceremony.title),
        description: ceremony.description,
        type: ceremony.type,
        basePrice: prices.basePrice,
        platformFee: prices.platformFee,
        price: prices.price,
        currency: "USD",
        duration: ceremony.duration,
        location: ceremony.location,
        videoUrl: ceremony.videoUrl,
        whatsappNumber: whatsappNumber,
        availableDates: ceremony.availableDates,
        published: true,
        approvalStatus: "approved",
      });
      created++;
      console.log(`✅ Created: ${ceremony.title}`);
    }

    // Create therapies
    for (const therapy of therapiesData) {
      const prices = calculatePrices(therapy.basePrice);
      await db.insert(therapies).values({
        id: randomUUID(),
        guideId: guide.id,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        category: "terapias",
        title: therapy.title,
        slug: generateSlug(therapy.title),
        description: therapy.description,
        type: therapy.type,
        basePrice: prices.basePrice,
        platformFee: prices.platformFee,
        price: prices.price,
        currency: "USD",
        duration: therapy.duration,
        location: therapy.location,
        googleMapsUrl: therapy.googleMapsUrl,
        videoUrl: therapy.videoUrl,
        whatsappNumber: whatsappNumber,
        availableDates: therapy.availableDates,
        published: true,
        approvalStatus: "approved",
      });
      created++;
      console.log(`✅ Created: ${therapy.title}`);
    }

    // Create microdosing
    for (const micro of microdosing) {
      const prices = calculatePrices(micro.basePrice);
      await db.insert(therapies).values({
        id: randomUUID(),
        guideId: guide.id,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        category: "microdosis",
        title: micro.title,
        slug: generateSlug(micro.title),
        description: micro.description,
        type: micro.type,
        basePrice: prices.basePrice,
        platformFee: prices.platformFee,
        price: prices.price,
        currency: "USD",
        duration: micro.duration,
        videoUrl: micro.videoUrl,
        whatsappNumber: whatsappNumber,
        inventory: micro.inventory,
        shippingOptions: micro.shippingOptions,
        published: true,
        approvalStatus: "approved",
      });
      created++;
      console.log(`✅ Created: ${micro.title}`);
    }

    // Create medicine
    for (const med of medicine) {
      const prices = calculatePrices(med.basePrice);
      await db.insert(therapies).values({
        id: randomUUID(),
        guideId: guide.id,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        category: "medicina",
        title: med.title,
        slug: generateSlug(med.title),
        description: med.description,
        type: med.type,
        basePrice: prices.basePrice,
        platformFee: prices.platformFee,
        price: prices.price,
        currency: "USD",
        videoUrl: med.videoUrl,
        whatsappNumber: whatsappNumber,
        inventory: med.inventory,
        shippingOptions: med.shippingOptions,
        specificFields: med.specificFields,
        published: true,
        approvalStatus: "approved",
      });
      created++;
      console.log(`✅ Created: ${med.title}`);
    }

    // Create events
    for (const event of events) {
      const prices = calculatePrices(event.basePrice);
      await db.insert(therapies).values({
        id: randomUUID(),
        guideId: guide.id,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        category: "eventos",
        title: event.title,
        slug: generateSlug(event.title),
        description: event.description,
        type: event.type,
        basePrice: prices.basePrice,
        platformFee: prices.platformFee,
        price: prices.price,
        currency: "USD",
        duration: event.duration,
        location: event.location,
        videoUrl: event.videoUrl,
        whatsappNumber: whatsappNumber,
        availableDates: event.availableDates,
        specificFields: event.specificFields,
        published: true,
        approvalStatus: "approved",
      });
      created++;
      console.log(`✅ Created: ${event.title}`);
    }

    // Create products
    for (const product of products) {
      const prices = calculatePrices(product.basePrice);
      await db.insert(therapies).values({
        id: randomUUID(),
        guideId: guide.id,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        category: "productos",
        title: product.title,
        slug: generateSlug(product.title),
        description: product.description,
        type: product.type,
        basePrice: prices.basePrice,
        platformFee: prices.platformFee,
        price: prices.price,
        currency: "USD",
        videoUrl: product.videoUrl,
        whatsappNumber: whatsappNumber,
        inventory: product.inventory,
        shippingOptions: product.shippingOptions,
        published: true,
        approvalStatus: "approved",
      });
      created++;
      console.log(`✅ Created: ${product.title}`);
    }

    console.log(`\n🎉 Successfully created ${created} listings in English!`);
    console.log("📊 Categories:");
    console.log(`   - Ceremonies: ${ceremonies.length}`);
    console.log(`   - Therapies: ${therapiesData.length}`);
    console.log(`   - Microdosing: ${microdosing.length}`);
    console.log(`   - Medicine: ${medicine.length}`);
    console.log(`   - Events: ${events.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Total: ${created}`);
    console.log("\n✅ All 84 listings created successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding listings:", error);
    process.exit(1);
  }
}

seedListings();
