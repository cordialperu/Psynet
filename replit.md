# PsycheConecta

## Overview

PsycheConecta is a curated marketplace connecting seekers with authentic healing experiences and alternative therapies in Peru. The platform focuses on plant medicine ceremonies (Ayahuasca, San Pedro, Kambo) and holistic healing practices, emphasizing trust, authenticity, and direct communication between guides and seekers via WhatsApp.

The application is built as a full-stack TypeScript web application with a modern React frontend and Express backend, featuring guide authentication, therapy listings, and a WhatsApp-based consultation workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript in strict mode
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management
- React Hook Form + Zod for form handling and validation

**UI System:**
- Shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible components
- Tailwind CSS for styling with custom design tokens
- Custom color palette inspired by Peruvian earth tones and natural healing aesthetics
- Typography: Playfair Display (serif headers) + Inter (sans-serif body)
- Dark/light theme support with system preference detection

**Design Philosophy:**
- Reference-based design inspired by Airbnb Experiences and Retreat.com
- High trust signals through authentic photography and transparent guide profiles
- Calm, grounded aesthetic respecting indigenous traditions
- Mobile-first responsive design

### Backend Architecture

**Framework & Runtime:**
- Express.js server with TypeScript
- Node.js ESM modules
- Custom Vite middleware integration for development HMR

**Database & ORM:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database queries
- Neon serverless PostgreSQL driver (@neondatabase/serverless)
- Schema-first design with automatic TypeScript type generation

**Authentication:**
- Custom session-based authentication using bcrypt for password hashing
- In-memory session store (Map-based) - suitable for development, should be replaced with Redis/database in production
- Bearer token authentication via Authorization headers
- Session data stored in localStorage on client
- Middleware-based route protection for admin/guide endpoints

**API Design:**
- RESTful API endpoints under `/api` prefix
- Consistent error handling with HTTP status codes
- Request/response logging middleware for debugging
- CRUD operations for guides and therapies

### Data Model

**Core Entities:**

1. **Guides Table:**
   - Stores therapeutic guide profiles and credentials
   - Fields: id (UUID), fullName, email, passwordHash, primarySpecialty, bio
   - Media: profilePhotoUrl, presentationVideoUrl
   - activeTherapies array for specializations
   - Timestamps: createdAt, updatedAt

2. **Therapies Table:**
   - Stores therapy/ceremony offerings
   - Guide relationship: guideId (foreign key with cascade delete)
   - Denormalized guide data: guideName, guidePhotoUrl for performance
   - Content: title, slug (unique), description, type
   - Pricing: price (numeric), currency (default USD)
   - Metadata: duration, location, availableDates array
   - Publishing: isPublished boolean flag
   - Timestamps: createdAt, updatedAt

**Data Access Patterns:**
- Repository pattern via `IStorage` interface with `DbStorage` implementation
- Type-safe queries using Drizzle ORM
- Filtering support for published therapies by type, location, and search
- Slug-based therapy lookups for SEO-friendly URLs

### External Dependencies

**Media & Assets:**
- Cloudinary planned for image/video optimization and transformation (currently using placeholder URLs and Unsplash)
- Static assets served from `attached_assets` directory
- Google Fonts: Playfair Display and Inter

**Communication:**
- WhatsApp integration for guide-seeker consultations
- Phone number configured via `VITE_WHATSAPP_PHONE_NUMBER` environment variable
- Deep linking to WhatsApp with pre-filled therapy inquiry messages

**Development Tools:**
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner
- ESBuild for production server bundling
- Drizzle Kit for database migrations

**Key NPM Packages:**
- @tanstack/react-query: Server state and caching
- @hookform/resolvers: Form validation integration
- bcrypt: Password hashing
- date-fns: Date formatting and manipulation
- class-variance-authority + clsx: Utility-first styling patterns
- zod: Runtime schema validation

**Environment Configuration:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `VITE_WHATSAPP_PHONE_NUMBER`: WhatsApp business number for consultations
- `NODE_ENV`: Development/production environment flag

**Deployment:**
- Target platform: Vercel
- Build output: Static frontend + bundled Node.js server
- SSR/SSG: Not implemented (SPA architecture)