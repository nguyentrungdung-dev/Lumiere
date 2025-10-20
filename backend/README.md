# Lumiere Backend

FastAPI backend for Lumiere - AI-powered data analysis platform for SMEs.

## 📋 Prerequisites

- Python 3.10+
- PostgreSQL 13+
- pip or poetry

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/lumiere
SECRET_KEY=your-secret-key-change-this
OPENAI_API_KEY=your-openai-api-key
```

### 3. Setup Database

Create the PostgreSQL database:

```bash
createdb lumiere
```

### 4. Run Migrations

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python main.py
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── core/          # Core configuration and security
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/        # SQLAlchemy models (39 tables)
│   │   ├── user.py
│   │   ├── data_source.py
│   │   ├── query.py
│   │   ├── agent.py
│   │   ├── conversation.py
│   │   ├── rag.py
│   │   ├── insight.py
│   │   ├── dashboard.py
│   │   ├── workspace.py
│   │   ├── export.py
│   │   └── system.py
│   ├── schemas/       # Pydantic schemas
│   │   ├── user.py
│   │   └── data_source.py
│   ├── routers/       # API routes
│   │   ├── auth.py
│   │   └── users.py
│   └── services/      # Business logic
│       └── user_service.py
├── alembic/           # Database migrations
├── main.py            # FastAPI app entry point
├── requirements.txt   # Python dependencies
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Register a new user:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

### Login:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword123"
  }'
```

### Access protected endpoints:

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Database Schema

The application uses 39 database tables organized into:

- **Authentication**: users, roles, user_roles, api_keys, password_resets
- **Data Sources**: data_sources, data_source_configs
- **Queries**: queries, query_history, query_results, query_metrics
- **AI Agents**: agents, agent_runs, orchestrator_runs
- **Conversations**: conversations, conversation_messages, conversation_memory
- **RAG**: rag_documents, embeddings, retrieval_sessions
- **Insights**: insights, prompt_templates
- **Dashboards**: dashboards, dashboard_shares, charts
- **Workspaces**: workspaces, workspace_items
- **Exports**: exports, scheduled_reports
- **System**: system_logs, notifications, usage_costs, alerts, business_glossary, audit_trails

See `/docs/DATABASE_SCHEMA.md` for complete schema details.

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🔧 Development

### Create a new migration:

```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Rollback migration:

```bash
alembic downgrade -1
```

### Add a new endpoint:

1. Create Pydantic schema in `app/schemas/`
2. Add business logic in `app/services/`
3. Create route in `app/routers/`
4. Include router in `main.py`

## 📝 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔗 Related Documentation

- [Project Context](/docs/CONTEXT.md)
- [API Specification](/docs/API_SPEC.md)
- [Database Schema](/docs/DATABASE_SCHEMA.md)
- [Development Roadmap](/docs/ROADMAP.md)

## 📄 License

Copyright © 2025 Lumiere

