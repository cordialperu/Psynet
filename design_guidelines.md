# PsycheConecta Design Guidelines

## Design Approach: Reference-Based (Wellness Marketplace)

**Primary References**: Airbnb Experiences, Retreat.com, Booking.com  
**Rationale**: This is an experience-focused marketplace requiring high trust signals, visual storytelling, and authentic representation of therapeutic practices. The design must balance spiritual authenticity with professional credibility.

**Core Design Principles**:
- Authenticity through high-quality photography and video
- Trust-building through transparent guide profiles
- Calm, grounded aesthetic respecting indigenous traditions
- Clear pathways to WhatsApp consultation

---

## Color Palette

**Light Mode**:
- Primary: `20 50% 40%` (Deep forest green - grounding, natural)
- Secondary: `35 45% 55%` (Warm terracotta - Peruvian earth tones)
- Accent: `180 30% 60%` (Soft sage - healing, calm)
- Background: `40 20% 98%` (Warm off-white)
- Text Primary: `20 15% 20%` (Dark charcoal)
- Text Secondary: `20 10% 45%` (Medium gray)

**Dark Mode**:
- Primary: `20 40% 65%` (Lighter sage green)
- Secondary: `35 50% 65%` (Warm clay)
- Accent: `180 25% 70%` (Light aqua)
- Background: `20 15% 12%` (Deep charcoal)
- Surface: `20 10% 18%` (Elevated charcoal)
- Text Primary: `40 15% 92%` (Soft white)
- Text Secondary: `20 8% 65%` (Light gray)

---

## Typography

**Font Families**:
- Headers: 'Playfair Display' (serif, elegant, trustworthy) - Google Fonts
- Body: 'Inter' (sans-serif, clean, highly legible) - Google Fonts

**Type Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-bold
- Card Titles: text-xl md:text-2xl, font-semibold
- Body Large: text-lg, font-normal
- Body: text-base, font-normal
- Small: text-sm, font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 (e.g., p-4, m-8, gap-6, py-20)

**Container Strategy**:
- Full-width: w-full with inner max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Content sections: max-w-6xl mx-auto
- Text-heavy content: max-w-4xl mx-auto

**Grid Patterns**:
- Therapy cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Featured therapies: grid-cols-1 md:grid-cols-2 gap-8
- Guide profiles: grid-cols-1 lg:grid-cols-3 gap-8

---

## Component Library

### Navigation
- Sticky header with logo, language switcher (EN/ES flag icons)
- Primary nav: "Explore", "How It Works", "For Guides"
- Mobile: Hamburger menu with slide-in drawer
- CTA button: "List Your Practice" (for guides)

### Therapy Cards
- Aspect ratio 4:3 image with overlay gradient
- Guide circular avatar (absolute positioned, bottom-left)
- Type badge (top-right): pill shape, subtle background blur
- Title, guide name, location (icon + text)
- Price display: bold, currency symbol + amount
- Hover: Subtle lift (shadow-lg), image zoom effect

### Guide Profile Module
- Large circular profile photo (w-32 h-32)
- Name (text-2xl, font-bold)
- Specialty badge
- Star rating (if applicable) + review count
- Bio excerpt with "Read more" expansion
- WhatsApp CTA button (primary, with icon)

### Date Picker
- Calendar grid with month/year navigation
- Available dates: highlighted in primary color
- Selected date: filled circle with accent color
- Past dates: disabled (opacity-40)
- Responsive: full-width on mobile, max-w-md on desktop

### Forms (Admin Dashboard)
- Full-width inputs with labels above
- Text inputs: border-2, rounded-lg, focus:ring-2 with primary color
- Textareas: min-h-32 for bios/descriptions
- File upload: Drag-and-drop zone with preview thumbnails
- Toggle switches for is_published (Tailwind UI style)
- Submit buttons: Full-width on mobile, auto-width on desktop

### CTAs
- Primary WhatsApp button: bg-green-600, with WhatsApp icon, shadow-lg
- Secondary buttons: outline variant with hover fill
- Button sizes: py-3 px-6 (default), py-4 px-8 (hero)

---

## Page-Specific Layouts

### Homepage (`/`)
**Hero Section** (min-h-[85vh]):
- Full-width background image: Peruvian landscape (Sacred Valley, mountains)
- Centered content with semi-transparent overlay (bg-black/40)
- H1: "Authentic Healing Experiences in Peru" (text-white)
- Subheading: "Connect with experienced guides for transformative ceremonies"
- Search bar: Location + Therapy type dropdowns + Search button
- Trust indicators below search: "50+ Verified Guides" | "200+ Ceremonies" | "Safe & Respectful"

**Featured Therapies** (py-20):
- H2: "Featured Experiences"
- 3-column grid of therapy cards
- "Explore All" link to /explore

**How It Works** (py-20, bg-surface):
- H2: "Your Journey to Healing"
- 3-column process cards with icons:
  1. Browse & Filter therapies
  2. Connect via WhatsApp
  3. Begin your transformation

**Trust Section** (py-20):
- H2: "Why Choose PsycheConecta"
- 2-column layout: Text + image
- Bullet points: Vetted guides, transparent pricing, cultural respect

**Footer**:
- 4-column grid: About, Therapies, Support, Legal
- Language switcher, social links
- Newsletter signup inline form

### Explore Page (`/explore`)
**Filter Bar** (sticky, bg-white/95 backdrop-blur):
- Therapy type pills (multi-select)
- Location dropdown
- Price range slider
- Clear filters button

**Results Grid** (py-12):
- Full therapy card grid
- Load more pagination or infinite scroll
- Results count display: "Showing X therapies"

### Therapy Detail (`/therapy/[slug]`)
**Hero** (grid-cols-1 lg:grid-cols-2, gap-12, py-12):
- Left: Guide presentation video (16:9 aspect ratio, rounded-xl)
- Right: Therapy title (h1), guide mini-profile, price, duration, location

**Description** (max-w-4xl, py-12):
- Rich text with prose styling (tailwindcss/typography)
- "What to Expect" section with bullet points

**Calendar & Booking** (py-12, bg-surface):
- H3: "Available Dates"
- Date picker component
- Selected date display
- WhatsApp CTA: "Reserve Your Spot - Consult via WhatsApp"

**Related Therapies** (py-20):
- "More from [Guide Name]" section
- Horizontal scroll or 3-column grid

### Admin Dashboard (`/admin/dashboard`)
**Sidebar Navigation** (fixed, w-64):
- Logo, guide name/photo
- Nav items: Profile, Therapies, Settings
- Logout button at bottom

**Main Content Area** (ml-64, p-8):
- Page header with title + action button
- Profile form: organized sections with clear labels
- Therapies table: sortable columns (Title, Type, Status, Actions)
- Action buttons: icon + text on desktop, icon-only on mobile

---

## Images

**Required Images**:
1. **Homepage Hero**: Panoramic shot of Sacred Valley or Peruvian mountains at golden hour (1920x1080px min)
2. **Therapy Cards**: High-quality photos of ceremony settings, nature scenes, or therapeutic environments (800x600px min)
3. **Guide Photos**: Professional headshots with natural backgrounds (400x400px square)
4. **Guide Videos**: Presentation videos (landscape 16:9, 1-2 minutes)
5. **How It Works Icons**: Custom illustrated icons for 3-step process
6. **Trust Section**: Authentic photo of guide conducting ceremony or preparing sacred space

**Image Treatment**:
- Subtle vignette overlays on hero images
- Rounded corners (rounded-lg to rounded-xl) on all therapy/guide images
- Lazy loading for performance
- Cloudinary transformations: auto-format, quality 80, responsive sizing

---

## Accessibility & UX Notes

- Maintain WCAG AA contrast ratios in both light/dark modes
- All interactive elements: min-height 44px for touch targets
- Form validation: inline error messages with red accent
- Loading states: Skeleton screens for therapy cards
- Empty states: Friendly illustrations with actionable messages
- Language switcher: Flag icons + text labels
- WhatsApp CTAs: Always include phone icon for instant recognition