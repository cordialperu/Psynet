# PsycheConecta - Setup Guide

## ✅ What's Been Done

I've reviewed and improved all files in the application:

### Files Created/Fixed:
1. ✅ **server/db.ts** - Database connection file
2. ✅ **package.json** - All dependencies configured
3. ✅ **tsconfig.json** - TypeScript configuration
4. ✅ **tsconfig.node.json** - Node TypeScript config
5. ✅ **scripts/build-server.ts** - Build script
6. ✅ **.env** - Environment variables
7. ✅ **.gitignore** - Updated to ignore .env files
8. ✅ **README.md** - Complete documentation
9. ✅ **vite.config.ts** - Fixed Replit plugins removed

### Code Improvements:
- ✅ Fixed all import paths
- ✅ Removed unused variables
- ✅ Optimized database queries
- ✅ All dependencies installed successfully

## 🔧 Next Steps to Run the App

### Option 1: Use a Free Cloud Database (Recommended)

1. **Get a free PostgreSQL database from Neon**:
   - Go to https://neon.tech
   - Sign up for free
   - Create a new project
   - Copy the connection string

2. **Update .env file**:
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **Push the database schema**:
   ```bash
   npm run db:push
   ```

4. **Start the app**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   ```
   http://localhost:5001
   ```

### Option 2: Install PostgreSQL Locally

1. **Install PostgreSQL**:
   ```bash
   # Using Homebrew on macOS
   brew install postgresql@16
   brew services start postgresql@16
   ```

2. **Create database**:
   ```bash
   createdb psycheconecta
   ```

3. **Update .env** (already configured for localhost)

4. **Push schema and start**:
   ```bash
   npm run db:push
   npm run dev
   ```

## 📱 Application Features

### Public Pages:
- **Home** (`/`) - Hero section with featured therapies
- **Explore** (`/explore`) - Browse and filter all therapies
- **Therapy Detail** (`/therapy/:slug`) - View therapy details and book via WhatsApp
- **How It Works** (`/how-it-works`) - Information page

### Admin Panel:
- **Login** (`/admin/login`) - Guide authentication
- **Register** (`/admin/register`) - New guide registration
- **Dashboard** (`/admin/dashboard`) - Manage profile and therapies
- **Create Therapy** (`/admin/therapies/new`) - Add new therapy
- **Edit Therapy** (`/admin/therapies/edit/:id`) - Update therapy

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Session-based with bcrypt
- **Routing**: Wouter (lightweight React router)
- **State**: TanStack Query (React Query)

## 🚀 Quick Start Commands

```bash
# Install dependencies (already done)
npm install

# Setup database schema
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 📝 Environment Variables

Update these in `.env`:

```bash
# Required
DATABASE_URL=your_postgresql_connection_string

# Optional but recommended
VITE_WHATSAPP_PHONE_NUMBER=51987654321
SESSION_SECRET=generate_a_random_secret_here
PORT=5001
```

## 🔍 Testing the App

1. **Register as a guide**: Go to `/admin/register`
2. **Create a therapy**: Add details, location, price
3. **Publish it**: Toggle the published status
4. **View on homepage**: See it in featured therapies
5. **Test booking**: Click WhatsApp button to initiate contact

## 📦 Project Structure

```
psyco/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── admin/    # Admin-specific components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── therapy-card.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── home.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── therapy-detail.tsx
│   │   │   └── admin/    # Admin pages
│   │   ├── lib/          # Utilities
│   │   └── hooks/        # Custom hooks
│   └── index.html
├── server/                # Express backend
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   ├── vite.ts           # Vite dev server
│   └── index.ts          # Entry point
├── shared/               # Shared code
│   └── schema.ts         # Database schema + types
├── attached_assets/      # Static assets
├── scripts/              # Build scripts
└── .env                  # Environment variables
```

## 🐛 Troubleshooting

### Port already in use
If port 5001 is busy, change `PORT` in `.env`

### Database connection error
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try using Neon (cloud database)

### Module not found errors
Run `npm install` again

### TypeScript errors
These are normal until dependencies are installed and database is connected

## 📚 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Neon Database](https://neon.tech/)

---

**Status**: ✅ App is ready! Just need to configure the database and run `npm run dev`
