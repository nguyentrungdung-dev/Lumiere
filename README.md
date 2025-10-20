# Lumiere

**AI-Powered Data Analysis Platform for SMEs**

Lumiere is a comprehensive data analysis platform that enables small and medium enterprises to analyze their data using natural language. Upload CSV files or connect databases, ask questions in plain language, and get SQL queries, visualizations, and insights powered by AI.

## 🌟 Features

- **Natural Language to SQL** - Ask questions in plain language, get SQL queries
- **Smart Visualizations** - Automatic chart generation based on your data
- **AI-Powered Insights** - Get actionable insights from your data
- **Multi-Source Connections** - Connect to PostgreSQL, MySQL, BigQuery, or upload CSV files
- **Conversational Analytics** - Chat with your data using AI agents
- **Beautiful Dashboards** - Create and share interactive dashboards
- **Role-Based Access** - Secure multi-user access control
- **Export & Scheduling** - Export results and schedule automated reports

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│            Frontend (React + TypeScript)         │
│                    Vite + TailwindCSS           │
└──────────────────┬──────────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────────┐
│            Backend (FastAPI + Python)            │
│                SQLAlchemy ORM                    │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│          Database (PostgreSQL)                   │
│              39 Tables                           │
└──────────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         AI Layer (OpenAI + RAG)                  │
│     SQL Generation | Charts | Insights          │
└──────────────────────────────────────────────────┘
```

## 📚 Documentation

- **[CONTEXT.md](/docs/CONTEXT.md)** - Project overview and architecture
- **[ROADMAP.md](/docs/ROADMAP.md)** - Complete development roadmap (3 phases)
- **[DATABASE_SCHEMA.md](/docs/DATABASE_SCHEMA.md)** - Detailed database schema (39 tables)
- **[API_SPEC.md](/docs/API_SPEC.md)** - API endpoints specification
- **[STYLE_GUIDE.md](/docs/STYLE_GUIDE.md)** - Coding standards and conventions
- **[AI_LAYER.md](/docs/AI_LAYER.md)** - AI architecture and prompts

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **OpenAI API Key** (for AI features)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp env.template .env
# Edit .env with your database and API credentials

# Create database
createdb lumiere

# Run migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Start server
uvicorn main:app --reload
```

Backend will be available at http://localhost:8000

API Documentation: http://localhost:8000/api/docs

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Frontend will be available at http://localhost:5173

## 📦 Project Structure

```
lumiere/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── core/        # Config, database, security
│   │   ├── models/      # SQLAlchemy models (39 tables)
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── routers/     # API endpoints
│   │   └── services/    # Business logic
│   ├── alembic/         # Database migrations
│   ├── main.py          # FastAPI app
│   └── requirements.txt
├── frontend/            # React frontend (coming soon)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
├── ai_layer/            # AI prompts and logic (coming soon)
│   ├── prompt_templates/
│   ├── sql_generation/
│   └── insight_analysis/
└── docs/                # Documentation
    ├── CONTEXT.md
    ├── ROADMAP.md
    ├── DATABASE_SCHEMA.md
    ├── API_SPEC.md
    ├── STYLE_GUIDE.md
    └── AI_LAYER.md
```

## 🎯 Current Status - Phase 1 (In Progress)

### ✅ Completed

**Backend Foundation:**
- [x] Complete FastAPI project structure
- [x] All 39 SQLAlchemy models with relationships
- [x] Database configuration and connection
- [x] Alembic migration system
- [x] JWT authentication system
- [x] User registration and login endpoints
- [x] Password hashing and security utilities
- [x] Pydantic schemas for validation
- [x] User management endpoints
- [x] CORS configuration
- [x] Environment configuration
- [x] Comprehensive documentation

**Database:**
- [x] Complete schema design (39 tables)
- [x] All relationships defined
- [x] Indexes and constraints

### 🔄 Next Steps

**Phase 1 Completion:**
- [ ] Run initial database migration
- [ ] Test authentication endpoints
- [ ] Set up frontend project
- [ ] Create login/register UI
- [ ] Build basic dashboard layout

**Phase 2 (Coming Next):**
- [ ] Data upload functionality
- [ ] AI query generation
- [ ] Chart visualization
- [ ] Insight generation

See [ROADMAP.md](/docs/ROADMAP.md) for complete development plan.

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS configuration
- API key support
- Role-based access control (RBAC)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **Alembic** - Database migrations
- **PostgreSQL** - Primary database
- **Pydantic** - Data validation
- **python-jose** - JWT tokens
- **passlib** - Password hashing

### Frontend (Coming Soon)
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

### AI Layer (Coming Soon)
- **OpenAI API** - LLM for SQL and insights
- **RAG** - Retrieval augmented generation
- **Embeddings** - Vector search

## 📝 API Endpoints (Current)

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info

### User Management
- `GET /api/v1/users/{id}` - Get user profile
- `PATCH /api/v1/users/{id}` - Update user info

More endpoints coming in Phase 2!

## 🤝 Contributing

This is a private project currently in development. Follow the coding standards in [STYLE_GUIDE.md](/docs/STYLE_GUIDE.md).

## 📄 License

Copyright © 2025 Lumiere. All rights reserved.

## 🔗 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Built with ❤️ for SMEs who want to make data-driven decisions**

