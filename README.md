# BahayCebu Properties

A modern real estate platform for property management and listings in Cebu, Philippines. The platform connects property seekers with real estate agents and provides comprehensive property information and management tools.

## Features

### Public Website
- Property listings with advanced filtering
- Detailed property information with image galleries
- Agent profiles and direct contact options
- Interactive loan calculator
- Travel times information
- Responsive design optimized for all devices
- Google Authentication for users
- Contact forms with multiple communication channels

### Agent Features
- Personalized agent profiles
- Property listing management
- Lead tracking and management
- Client communication tools

### Admin Dashboard
A comprehensive admin dashboard for property and agent management with the following features:

#### Property Management
- Complete property CRUD operations
- Bulk image upload and management
- Unit type management
- Property status tracking
- Advanced property search and filtering
- Property analytics and metrics

#### Agent Management
- Agent profile management
- Performance tracking
- Lead assignment
- Communication tools

#### Analytics Dashboard
- Property performance metrics
- Lead generation statistics
- User engagement analytics
- Market trend analysis

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BahayCebu-Properties.git
cd BahayCebu-Properties
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/bahaycebu"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
JWT_SECRET="your_jwt_secret"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
  - Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Google OAuth integration
- **Data Visualization**: Recharts
- **Image Handling**: React Image Crop
- **UI Components**:
  - Embla Carousel
  - Sonner notifications
  - Custom UI components

### Backend
- **Server**: Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT + Google OAuth
- **API**: RESTful endpoints
- **File Storage**: Local storage with image optimization

### Development Tools
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm
- **Database Migrations**: Prisma Migrate
- **API Testing**: Thunder Client/Postman

## Project Structure

```
src/
├── Admin/                  # Admin dashboard components
├── app/                    # App configuration and API routes
├── components/
│   ├── ui/                # Base UI components
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components
│   └── properties/        # Property-related components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── pages/                 # Page components
├── services/              # API services
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For inquiries and support, please contact:
- Website: [BahayCebu Properties](https://bahayceburealty.com)
- Email: info@bahayceburealty.com

