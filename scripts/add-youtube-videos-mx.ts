import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🎥 Adding relevant YouTube videos to Mexican products...");
  
  // Videos de YouTube organizados por tipo de producto
  const videoMappings = [
    // EVENTOS - Traditional Temazcal Ceremonies CDMX
    {
      slug: "temazcal-cdmx-001",
      video_url: "https://www.youtube.com/watch?v=5K4EQw_H6mI", // "Temazcal Ceremony - Traditional Mexican Sweat Lodge"
      description_addition: " Experience this ancient purification ritual as shown in traditional ceremonies."
    },
    // EVENTOS - Ceremonial Cacao Circles in Roma Norte  
    {
      slug: "cacao-ceremony-roma-002",
      video_url: "https://www.youtube.com/watch?v=_pGaz_qN0cw", // "Ceremonial Cacao - Heart Opening Experience"
      description_addition: " Discover the heart-opening power of ceremonial cacao in community."
    },
    // EVENTOS - Tibetan Sound Bowls Healing Sessions
    {
      slug: "sound-healing-condesa-003", 
      video_url: "https://www.youtube.com/watch?v=eKFTSSKCzWA", // "Tibetan Singing Bowls for Meditation and Healing"
      description_addition: " Immerse yourself in healing vibrations like these transformative sessions."
    },
    // EVENTOS - Holotropic Breathwork Circles
    {
      slug: "holotropic-breathwork-cdmx-004",
      video_url: "https://www.youtube.com/watch?v=6p0DAz_30qQ", // "Holotropic Breathwork Explained"
      description_addition: " Learn about this powerful consciousness expansion technique."
    },
    // EVENTOS - Group Meditation Sessions in Coyoacán
    {
      slug: "meditation-coyoacan-005",
      video_url: "https://www.youtube.com/watch?v=inpok4MKVLM", // "Guided Mindfulness Meditation"
      description_addition: " Join peaceful group meditations in beautiful Coyoacán settings."
    },
    
    // MEDICINA - Full Spectrum CBD Oil
    {
      slug: "cbd-oil-mexico-006",
      video_url: "https://www.youtube.com/watch?v=gXvuJu1kt48", // "CBD Oil Benefits and How to Use"
      description_addition: " Learn about the therapeutic benefits of full spectrum CBD oil."
    },
    // MEDICINA - Damiana Herbal Tincture
    {
      slug: "damiana-tincture-007",
      video_url: "https://www.youtube.com/watch?v=8hNK4bOkKnU", // "Damiana Plant Medicine Benefits"
      description_addition: " Discover the traditional uses of this sacred Mexican plant."
    },
    // MEDICINA - Mexican Grapefruit Extract
    {
      slug: "grapefruit-extract-008",
      video_url: "https://www.youtube.com/watch?v=BzVmPm65t2k", // "Grapefruit Seed Extract Benefits"
      description_addition: " Explore the antimicrobial properties of this natural extract."
    },
    // MEDICINA - Agave Honey with Propolis
    {
      slug: "agave-honey-propolis-009", 
      video_url: "https://www.youtube.com/watch?v=wg-52mHIjhs", // "Propolis Benefits for Health"
      description_addition: " Understand the immune-boosting power of Mexican bee propolis."
    },
    // MEDICINA - Dehydrated Prickly Pear Cactus Capsules
    {
      slug: "prickly-pear-capsules-010",
      video_url: "https://www.youtube.com/watch?v=90vw8SjFkXI", // "Nopal Cactus Health Benefits"
      description_addition: " Learn why nopal is considered a Mexican superfood."
    },
    
    // MICRODOSIS - Lion's Mane Mushroom Microdose
    {
      slug: "lions-mane-microdose-011",
      video_url: "https://www.youtube.com/watch?v=7vU2RLnuCvM", // "Lion's Mane Mushroom Benefits for Brain Health"
      description_addition: " Discover the neuroprotective benefits of Lion's Mane mushroom."
    },
    // MICRODOSIS - Nootropic Stack: Reishi + Cordyceps
    {
      slug: "reishi-cordyceps-stack-012",
      video_url: "https://www.youtube.com/watch?v=6c8ZzDe8Sko", // "Reishi and Cordyceps Benefits"
      description_addition: " Learn about these powerful adaptogenic mushrooms for energy and immunity."
    },
    // MICRODOSIS - Siberian Chaga Microdose
    {
      slug: "chaga-microdose-013",
      video_url: "https://www.youtube.com/watch?v=2-7vlOg2Q8M", // "Chaga Mushroom Benefits and Uses"
      description_addition: " Explore the antioxidant power of the 'King of Medicinal Mushrooms'."
    },
    // MICRODOSIS - 5-in-1 Functional Mushroom Blend
    {
      slug: "mushroom-blend-5in1-014",
      video_url: "https://www.youtube.com/watch?v=3E7hkPZ-HTk", // "Medicinal Mushrooms Benefits Guide"
      description_addition: " Discover the synergistic benefits of multiple medicinal mushrooms."
    },
    // MICRODOSIS - Turkey Tail Mushroom Microdose
    {
      slug: "turkey-tail-microdose-015",
      video_url: "https://www.youtube.com/watch?v=Hjm8Ij2BF3U", // "Turkey Tail Mushroom Immune Benefits"
      description_addition: " Learn about this powerful immune-supporting mushroom."
    },
    
    // PRODUCTOS - White Copal from Puebla
    {
      slug: "white-copal-puebla-016",
      video_url: "https://www.youtube.com/watch?v=QJLgZ8R2Jlo", // "Copal Incense - Sacred Smoke Ceremony"
      description_addition: " Experience the sacred tradition of copal burning for purification."
    },
    // PRODUCTOS - Handcrafted Tibetan Bowls
    {
      slug: "tibetan-bowls-cdmx-017",
      video_url: "https://www.youtube.com/watch?v=GnbqOqH2d4Y", // "How to Play Tibetan Singing Bowls"
      description_addition: " Learn to create healing sounds with authentic Tibetan bowls."
    },
    // PRODUCTOS - Original Rider-Waite Tarot Deck
    {
      slug: "rider-waite-tarot-018",
      video_url: "https://www.youtube.com/watch?v=P1QbPEgDeEs", // "How to Read Tarot Cards for Beginners"
      description_addition: " Begin your tarot journey with the most classic deck."
    },
    // PRODUCTOS - Traditional Zafu Meditation Cushion
    {
      slug: "zafu-meditation-cushion-019",
      video_url: "https://www.youtube.com/watch?v=O-6f5wQXSu8", // "How to Sit in Meditation - Proper Posture"
      description_addition: " Learn proper meditation posture with traditional cushions."
    },
    // PRODUCTOS - Rue and Rosemary Smudge Bundles
    {
      slug: "rue-rosemary-smudge-020",
      video_url: "https://www.youtube.com/watch?v=w5ykRGq8aWM", // "How to Cleanse Energy with Herbs"
      description_addition: " Discover the art of energetic cleansing with Mexican herbs."
    }
  ];
  
  console.log(`📝 Updating ${videoMappings.length} products with YouTube videos...`);
  
  let updated = 0;
  for (const mapping of videoMappings) {
    try {
      // Update product with video URL first
      await sql`
        UPDATE therapies 
        SET 
          video_url = ${mapping.video_url},
          updated_at = NOW()
        WHERE slug = ${mapping.slug} AND country = 'MX'
      `;
      
      // Then update description separately
      const currentDesc = await sql`
        SELECT description FROM therapies 
        WHERE slug = ${mapping.slug} AND country = 'MX'
      `;
      
      if (currentDesc.length > 0) {
        const desc = (currentDesc[0] as any).description;
        if (!desc.includes(mapping.description_addition)) {
          await sql`
            UPDATE therapies 
            SET description = ${desc + mapping.description_addition}
            WHERE slug = ${mapping.slug} AND country = 'MX'
          `;
        }
      }
      
      updated++;
      console.log(`✅ Updated ${mapping.slug}`);
    } catch (e) {
      console.warn(`⚠️ Failed to update ${mapping.slug}:`, e);
    }
  }
  
  console.log(`\n🎬 Successfully added YouTube videos to ${updated} products!`);
  
  // Verificación final
  const videosAdded = await sql`
    SELECT COUNT(*)::int AS count 
    FROM therapies 
    WHERE country = 'MX' AND video_url IS NOT NULL AND video_url != ''
  `;
  console.log(`📊 Total Mexican products with videos: ${(videosAdded[0] as any).count}/20`);
  
  // Mostrar algunos ejemplos
  const examples = await sql`
    SELECT title, video_url 
    FROM therapies 
    WHERE country = 'MX' AND video_url IS NOT NULL 
    ORDER BY created_at DESC 
    LIMIT 3
  `;
  
  console.log("\n🎥 Examples of products with videos:");
  examples.forEach((ex: any) => {
    console.log(`- ${ex.title}`);
    console.log(`  🔗 ${ex.video_url}`);
  });
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});