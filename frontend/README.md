# Lumiere Frontend

React + TypeScript frontend for Lumiere - AI-powered data analysis platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

## 📁 Project Structure

```
src/
├── pages/              # Page components
├── components/         # Reusable components
│   ├── layout/        # Layout components
│   ├── auth/          # Auth-related components
│   └── common/        # Common UI components
├── services/          # API services
├── context/           # React Context providers
├── hooks/             # Custom hooks
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **React Query** - Server state
- **Axios** - HTTP client
- **Zustand** - State management

## 📜 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔗 API Connection

The frontend connects to the backend API at:
- Development: http://localhost:8000
- Configure in `.env` file

## 📝 Environment Variables

See `.env.example` for required environment variables:
- `VITE_API_URL` - Backend API URL
- `VITE_API_BASE_PATH` - API base path (/api/v1)

## 🎨 Features

### Phase 1 (Current)
- ✅ User authentication (login/register)
- ✅ Protected routes
- ✅ User profile management
- ✅ Responsive dashboard

### Phase 2 (Coming Soon)
- Data upload interface
- AI query interface
- Chart visualization
- Insight display

## 🤝 Contributing

Follow the coding standards in `/docs/STYLE_GUIDE.md`

## 📄 License

Copyright © 2025 Lumiere
