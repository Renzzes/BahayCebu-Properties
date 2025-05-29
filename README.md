# BahayCebu Properties

A modern real estate platform for property management and listings.

## Features

### Public Website
- Property listings
- Property details
- Contact forms
- Responsive design

### Admin Dashboard
A minimalist admin dashboard for property management with the following features:

#### Sidebar Navigation
- **Dashboard**: Overview with key metrics and stats
- **Message**: Message management (placeholder)
- **Properties**: Complete property management
- **Profile**: User profile settings (placeholder)

#### Property Management
- **View Properties**: Grid layout with property cards showing:
  - Property images
  - Property name and address
  - Number of units and occupancy rate
  - Status badges (Active, Off Market, Sold)
  - Last updated date
  - 30-day stats (views, leads, applications)
  - Edit and delete buttons

- **Add Properties**: Modal form for adding new properties with:
  - Property name
  - Address
  - Image upload
  - Number of units
  - Occupancy rate percentage
  - Status selection (dropdown)

- **Edit Properties**: In-place editing with pre-populated forms
- **Delete Properties**: One-click property removal
- **Search Properties**: Real-time search by name or address

#### Dashboard Analytics
- Total Properties count
- Total Views (30-day aggregate)
- Total Leads (30-day aggregate)
- Total Applications (30-day aggregate)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the admin dashboard:
```
http://localhost:5173/admin
```

## Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router
- **Forms**: React Hook Form
- **Build Tool**: Vite

## Project Structure

```
src/
├── Admin/
│   └── Dashboard.tsx       # Main admin dashboard
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   └── properties/         # Property-related components
├── pages/                  # Public website pages
└── lib/                    # Utilities and helpers
```

## Design Features

- **Minimalist Design**: Clean, modern interface with plenty of whitespace
- **Responsive Grid**: Property cards adapt to different screen sizes
- **Hover Effects**: Smooth transitions and shadow effects
- **Status Badges**: Color-coded property status indicators
- **Image Handling**: Upload, preview, and fallback images
- **Modal Forms**: Clean, accessible form dialogs
- **Search Functionality**: Real-time property filtering

## Admin Dashboard Access

Navigate to `/admin` or `/admin/dashboard` to access the admin interface. The dashboard provides a complete property management system with an intuitive, modern design that matches the BahayCebu brand aesthetic.

Tech Stack
This project is built with a modern and robust tech stack to ensure scalability, performance, and developer experience. Below is a detailed breakdown of the technologies used:
Frontend

React (v18.3.1): Main frontend framework for building dynamic user interfaces.
TypeScript: Strongly-typed programming language for enhanced code quality and maintainability.
Vite (v5.4.1): Fast build tool and development server for an optimized development experience.
TailwindCSS (v3.4.11): Utility-first CSS framework for rapid and responsive styling.
Radix UI: Accessible and customizable UI components for building inclusive interfaces.
React Router DOM (v6.30.0): Declarative routing for client-side navigation.
React Query (@tanstack/react-query): Powerful data fetching and state management library.
React Hook Form: Performant and flexible library for form handling and validation.
Zod: TypeScript-first schema validation for robust data validation.
Recharts: Lightweight library for creating interactive data visualizations.
Lucide React: Modern, customizable icon library for a consistent UI.

Backend

Express.js: Minimal and flexible Node.js framework for building RESTful APIs.
Prisma (v6.7.0): Next-generation ORM for seamless database operations.
bcryptjs: Secure password hashing for user authentication.
CORS: Middleware for enabling Cross-Origin Resource Sharing.

Development Tools

ESLint: Linting tool for maintaining consistent code quality.
PostCSS: CSS post-processing for enhanced styling capabilities.
SWC (via @vitejs/plugin-react-swc): Ultra-fast JavaScript/TypeScript compiler for improved build performance.

UI Component Libraries

shadcn/ui: Modern, customizable UI components (implied by project structure).
Radix UI Components: Accessible UI primitives for building robust interfaces.
Tailwind Typography: Enhanced typography styling for content-heavy applications.
Embla Carousel: Performant and customizable carousel/slider components.
Sonner: Lightweight and customizable toast notification library.
Vaul: Additional UI components for enriched user interactions.

