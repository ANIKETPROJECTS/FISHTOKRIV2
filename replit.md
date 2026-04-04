# FishTokri

A mobile-first, full-stack web application for an online fresh fish, seafood, and meat retailer based in Mumbai. Provides a premium, app-like storefront for customers and a protected admin panel for inventory and order management.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express 5
- **Database**: MongoDB with Mongoose ODM
- **Auth**: Passport.js (local strategy) with session-based auth via connect-mongo
- **State/Data**: TanStack Query (React Query), React Context (cart)
- **Routing**: wouter
- **UI Components**: Radix UI / shadcn-ui, Lucide icons, Embla Carousel

## Project Structure

- `client/` — React frontend (Vite)
  - `src/components/storefront/` — Customer-facing components
  - `src/components/admin/` — Admin panel components
  - `src/components/ui/` — Shared Radix/shadcn UI components
  - `src/pages/storefront/` — Storefront pages (Home, Product Detail, Profile)
  - `src/pages/admin/` — Admin pages (Dashboard, Orders, Products)
  - `src/hooks/` — Custom React hooks
  - `src/context/` — Cart context
- `server/` — Express backend
  - `index.ts` — Entry point, middleware setup
  - `routes.ts` — API route definitions
  - `db.ts` — MongoDB connection and Mongoose models
  - `storage.ts` — Data access layer (IStorage interface)
  - `auth.ts` — Passport.js authentication
  - `vite.ts` — Vite dev server middleware (development only)
  - `static.ts` — Static file serving (production only)
  - `imageStore.ts` — Image storage handling
- `shared/` — Shared TypeScript types and Zod schemas
- `script/` — Build scripts

## Environment Variables

- `MONGODB_URI` — MongoDB connection string (required, set as a secret)
- `MONGODB_DB` — Database name (optional, defaults to "fishtokri")
- `SESSION_SECRET` — Express session secret (recommended for production)
- `PORT` — Server port (defaults to 5000)

## Running the App

- **Development**: `npm run dev` — starts the Express server with Vite middleware
- **Build**: `npm run build` — builds the frontend to `dist/public`
- **Production**: `npm start` — serves the built frontend + API

## Key Features

### Customer Storefront
- Dynamic product browsing with category filters (Fish, Prawns, Chicken, Mutton, Masalas, etc.)
- Carousel banners, "Today's Fresh Catch" hero section
- Shopping cart with slide-up drawer and order request flow
- Availability badges, combo specials
- Homepage sections driven by MongoDB `sections` collection — fully dynamic

### Admin Panel
- Secure login (session-based auth)
- Dashboard with summary statistics and availability toggles
- Full CRUD for products and categories
- Order management (pending/confirmed)
- Carousel slide management
- **Sections management** (`/admin/sections`) — create/edit/delete homepage sections; sections have a `type` ("products" or "combos"), `sortOrder`, and `isActive` toggle
- Products have a `sectionId` field to assign them to a specific homepage section
