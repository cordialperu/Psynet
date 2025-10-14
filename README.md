# Psynet

Curated marketplace for authentic healing experiences and alternative therapies in Peru.

## Features

- 🌿 Browse plant medicine ceremonies (Ayahuasca, San Pedro, Kambo)
- 👥 Connect directly with verified guides via WhatsApp
- 📅 Calendar-based booking system
- 🎨 Modern, responsive UI with dark/light theme support

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
# Database - Replace with your PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/psycheconecta

# WhatsApp - Replace with your business number
VITE_WHATSAPP_PHONE_NUMBER=51987654321
```

### 2. Database Setup

Make sure you have PostgreSQL running, then push the schema:

```bash
npm run db:push
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations

## Project Structure

```
psyco/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── auth.ts          # Authentication logic
│   ├── db.ts            # Database connection
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data access layer
├── shared/              # Shared types and schemas
└── attached_assets/     # Static assets
```

## Admin Panel

Access the admin panel at `/admin/login` to:
- Register as a guide
- Manage your profile
- Create and publish therapies
- View your listings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new guide
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Therapies
- `GET /api/therapies/featured` - Get featured therapies
- `GET /api/therapies/published` - Get all published therapies
- `GET /api/therapies/slug/:slug` - Get therapy by slug
- `GET /api/therapies/my-therapies` - Get guide's therapies (auth required)
- `POST /api/therapies` - Create therapy (auth required)
- `PATCH /api/therapies/:id` - Update therapy (auth required)
- `DELETE /api/therapies/:id` - Delete therapy (auth required)

### Guides
- `PATCH /api/guides/profile` - Update guide profile (auth required)

## License

MIT
