# Vivaha - Wedding Planning Platform

A comprehensive web application for planning multicultural weddings with personalized onboarding, budget management, vendor coordination, guest lists, and AI-powered assistance.

## Project Structure

```
vivaha/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                # Node.js/Express backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database models
│   │   └── index.ts       # Server entry point
│   └── package.json
├── shared/                # Shared types and utilities
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── public/                # Public assets
│   ├── images/           # Images and photos
│   └── html/             # HTML files
├── config/                # Configuration files
├── emails/                # Email templates
├── data/                  # Data files
├── media/                 # Video and media files
└── README.md             # This file
```

## Technology Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Authentication**: JWT-based auth
- **AI**: Claude integration for wedding planning assistance

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tanikellapratik23/Vivaha_repo.git
cd Vivaha_repo
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

### Environment Variables

Create `.env` files in both `server` and `client` directories with required variables:

**server/.env**
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
VITE_API_URL=http://localhost:3000
```

**client/.env**
```
VITE_API_URL=http://localhost:3000
```

### Running Locally

1. Start the backend server (from `/server`)
```bash
npm run dev
```

2. Start the frontend (from `/client`)
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Building for Production

**Frontend**
```bash
cd client
npm run build
```

**Backend**
```bash
cd server
npm run build
```

## Features

- 🎭 **Multicultural Wedding Planning** - Support for interfaith ceremonies
- 👥 **Guest Management** - Track RSVPs and seating arrangements
- 💰 **Budget Tracking** - Manage expenses by category
- 🏪 **Registry Management** - Browse and manage registries from multiple providers
- 🤖 **AI Assistant** - Claude-powered wedding planning advice
- 💸 **Expense Splitting** - Track and split wedding costs fairly
- 🎵 **Music & Sound** - Coordinate ceremony and reception music
- 📋 **Task Management** - Track wedding planning tasks
- 🏨 **Hotel Blocks** - Manage group hotel bookings

## API Documentation

API endpoints are RESTful and require JWT authentication for most operations. See `/docs` for detailed API documentation.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Security

- Never commit sensitive credentials or API keys
- Use environment variables for configuration
- JWT tokens are required for authenticated endpoints
- Passwords are hashed with bcryptjs

## License

Proprietary - All rights reserved

## Support

For issues and questions, please open a GitHub issue or contact the development team.

<!-- Deployment configuration refresh: 2026-07-31 -->
