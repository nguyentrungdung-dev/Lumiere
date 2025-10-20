# Lumiere - Development Roadmap

## 🗺️ Complete 3-Phase Development Plan

This document outlines the complete development roadmap for Lumiere, covering both backend and frontend implementation.

---

## **PHASE 1: Foundation & Authentication** 🏗️

### Backend Tasks

#### 1.1 Project Setup
- [x] Initialize FastAPI project structure (`backend/app/`)
- [x] Set up SQLAlchemy ORM configuration
- [x] Configure PostgreSQL connection
- [x] Create database migration system (Alembic)
- [x] Set up environment variables (.env)
- [x] Create requirements.txt with dependencies

#### 1.2 Database Models
- [x] Create all SQLAlchemy models based on schema (39 tables)
- [x] Set up relationships (ForeignKeys, back_populates)
- [ ] Create initial migration
- [ ] Test database connection

#### 1.3 Authentication System
- [x] POST `/auth/register` - Create new user with password hashing
- [x] POST `/auth/login` - JWT token generation
- [x] GET `/auth/me` - Get current user info
- [x] Auth middleware/dependencies for protected routes
- [x] Password hashing utilities (bcrypt)
- [x] JWT token utilities (encode/decode)

#### 1.4 User Management
- [x] GET `/users/{id}` - Get user profile
- [x] PATCH `/users/{id}` - Update user info
- [x] User service layer with business logic
- [x] Input validation with Pydantic schemas

### Frontend Tasks

#### 1.5 Project Setup
- [ ] Initialize Vite + React + TypeScript
- [ ] Install dependencies (React Router, Axios, TailwindCSS)
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up API service layer (`services/api.ts`)
- [ ] Configure environment variables

#### 1.6 Authentication UI
- [ ] `LoginPage.tsx` - Login form with validation
- [ ] `RegisterPage.tsx` - Registration form
- [ ] Auth context/hook for managing user state
- [ ] Protected route wrapper component
- [ ] Token storage (localStorage + axios interceptors)
- [ ] Error handling and display

#### 1.7 Layout & Navigation
- [ ] `Layout.tsx` - Main app layout with sidebar/navbar
- [ ] `Dashboard.tsx` - Landing page after login
- [ ] Routing setup (React Router v6)
- [ ] Navigation menu component
- [ ] User profile dropdown

### Deliverable
✅ Users can register, login, and see a basic dashboard.

---

## **PHASE 2: Core Data & AI Features** 🤖

### Backend Tasks

#### 2.1 Data Upload Module
- [ ] POST `/data/upload` - CSV file upload endpoint
- [ ] File parser (parse CSV → store in temp table or user schema)
- [ ] GET `/data/sources` - List all data sources
- [ ] GET `/data/source/{id}` - Get specific data source
- [ ] DELETE `/data/source/{id}` - Delete data source
- [ ] Service for managing data source metadata
- [ ] File size and format validation

#### 2.2 Database Connector (Optional for Phase 2)
- [ ] POST `/data/connect` - Connect to external PostgreSQL/MySQL
- [ ] Validate database connection
- [ ] Fetch schema information
- [ ] Test connection endpoint

#### 2.3 AI Query Module
- [ ] POST `/ai/query` - Generate SQL from natural language
- [ ] LLM integration (OpenAI API or similar)
- [ ] SQL execution on user data
- [ ] Return structured results
- [ ] Error handling for invalid SQL
- [ ] Query validation and sanitization
- [ ] Store query history

#### 2.4 Chart Generation Module
- [ ] POST `/ai/chart` - Analyze SQL results and suggest chart type
- [ ] Generate Chart.js compatible configuration
- [ ] Return chart config JSON
- [ ] Support multiple chart types (bar, line, pie, scatter)

#### 2.5 Insight Generation Module
- [ ] POST `/ai/insight` - Generate insights from data
- [ ] Summarization using LLM
- [ ] Store insights in database
- [ ] Link insights to queries

### AI Layer Tasks

#### 2.6 Prompt Templates
- [ ] Create `sql_generation_prompt.txt`
- [ ] Create `chart_generation_prompt.txt`
- [ ] Create `insight_prompt.txt`
- [ ] Create prompt testing utilities

#### 2.7 LLM Service
- [ ] OpenAI API integration
- [ ] Prompt formatting utilities
- [ ] Response parsing and validation
- [ ] Cost tracking per API call
- [ ] Error handling and retries

### Frontend Tasks

#### 2.8 Data Upload Interface
- [ ] `DataUploadPage.tsx` - CSV upload with drag-and-drop
- [ ] `DataSourcesList.tsx` - Show all uploaded/connected data
- [ ] File validation (size, format)
- [ ] Upload progress indicator
- [ ] Success/error notifications

#### 2.9 AI Query Interface
- [ ] `QueryPage.tsx` - Main analysis interface
- [ ] Text input for natural language questions
- [ ] Display generated SQL (read-only, with syntax highlighting)
- [ ] Show query results in table format
- [ ] Loading states and animations
- [ ] Error handling and display

#### 2.10 Chart Visualization
- [ ] `ChartViewer.tsx` - Render charts using Chart.js or Recharts
- [ ] Support bar, line, pie, scatter charts
- [ ] Chart customization options
- [ ] Export chart functionality (PNG, SVG)
- [ ] Responsive chart sizing

#### 2.11 Insight Display
- [ ] `InsightPanel.tsx` - Show AI-generated insights
- [ ] Markdown rendering for formatted insights
- [ ] Copy insights to clipboard
- [ ] Save insights for later

#### 2.12 Query History
- [ ] `QueryHistory.tsx` - List previous queries
- [ ] Re-run past queries
- [ ] Delete queries
- [ ] Search and filter history

### Deliverable
✅ Users can upload CSV, ask questions, get SQL queries, see charts, and read insights.

---

## **PHASE 3: Advanced Features & Polish** ✨

### Backend Tasks

#### 3.1 Chat Interface for Insights
- [ ] POST `/chat/send` - Send message, get AI response
- [ ] GET `/chat/history` - Get chat history
- [ ] GET `/chat/sessions` - List all chat sessions
- [ ] DELETE `/chat/session/{id}` - Delete chat session
- [ ] Conversational context management
- [ ] Multi-turn conversation support

#### 3.2 Admin Module
- [ ] GET `/admin/metrics` - System-wide statistics
- [ ] GET `/admin/users` - List all users (paginated)
- [ ] PATCH `/admin/users/{id}/plan` - Update user plan
- [ ] GET `/admin/costs` - Cost tracking per user
- [ ] Usage limits enforcement
- [ ] Admin authentication and authorization

#### 3.3 Subscription/Plan Management
- [ ] Plan limits (queries per month, data sources, etc.)
- [ ] Usage tracking middleware
- [ ] Plan upgrade/downgrade logic
- [ ] Check usage before allowing actions
- [ ] Billing integration (optional)

#### 3.4 Advanced Features
- [ ] Query scheduling (run queries on schedule)
- [ ] Email notifications for insights
- [ ] Export results to CSV/PDF
- [ ] Query sharing (share with team members)
- [ ] Collaborative workspaces

#### 3.5 Performance & Security
- [ ] Rate limiting (per user, per endpoint)
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] Query timeout handling
- [ ] Caching layer (Redis optional)
- [ ] Database query optimization
- [ ] API documentation (OpenAPI/Swagger)

### Frontend Tasks

#### 3.6 Chat Interface
- [ ] `ChatPage.tsx` - Conversational AI interface
- [ ] Message bubbles (user vs AI)
- [ ] Real-time typing indicators
- [ ] Context-aware conversations
- [ ] Chat history sidebar
- [ ] New chat session button

#### 3.7 Admin Dashboard
- [ ] `AdminDashboard.tsx` - System overview
- [ ] Metrics visualization (total users, queries, costs)
- [ ] User management table with actions
- [ ] Plan management interface
- [ ] Cost analytics charts

#### 3.8 User Settings
- [ ] `SettingsPage.tsx` - User preferences
- [ ] Plan upgrade interface
- [ ] API key management (if applicable)
- [ ] Usage statistics and limits
- [ ] Account deletion

#### 3.9 Advanced UI Features
- [ ] Dark mode toggle (with persistence)
- [ ] Responsive design (mobile-friendly)
- [ ] Keyboard shortcuts
- [ ] Toast notifications system
- [ ] Error boundaries
- [ ] Accessibility improvements (ARIA labels)

#### 3.10 Polish & UX
- [ ] Loading skeletons
- [ ] Empty states for all pages
- [ ] Error messages with helpful hints
- [ ] Onboarding tutorial/tour
- [ ] Help documentation
- [ ] Tooltips and hints
- [ ] Animations and transitions

### Deliverable
✅ Full-featured production-ready application with admin controls, chat, and excellent UX.

---

## 📊 Phase Summary

| Phase | Backend | Frontend | AI Layer | Duration (Est.) |
|-------|---------|----------|----------|-----------------|
| **Phase 1** | Auth + DB Setup | Login/Register + Layout | - | 1-2 weeks |
| **Phase 2** | Data Upload + AI Endpoints | Query Interface + Charts | Prompts + LLM Integration | 3-4 weeks |
| **Phase 3** | Chat + Admin + Polish | Chat UI + Admin Dashboard | Conversational Context | 2-3 weeks |

**Total Estimated Duration:** 6-9 weeks

---

## 🎯 Development Principles

1. **Sequential with Parallel Work**
   - Build backend endpoint → Build corresponding frontend page
   - Test each feature before moving to the next
   - Keep both codebases in sync

2. **Code Quality**
   - Follow `/docs/STYLE_GUIDE.md` religiously
   - Write clean, modular, and typed code
   - Add comments for complex logic

3. **Testing**
   - Test each endpoint with sample data
   - Validate frontend forms properly
   - Handle edge cases and errors

4. **Documentation**
   - Update API_SPEC.md as endpoints are built
   - Document any deviations from plan
   - Keep README updated

---

## 📝 Progress Tracking

Update this section as phases are completed:

- [ ] **Phase 1 Complete** - Date: ___________
- [ ] **Phase 2 Complete** - Date: ___________
- [ ] **Phase 3 Complete** - Date: ___________

---

## 🔗 Related Documents

- [CONTEXT.md](./CONTEXT.md) - Project overview
- [API_SPEC.md](./API_SPEC.md) - API endpoints specification
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Coding standards
- [AI_LAYER.md](./AI_LAYER.md) - AI architecture details

---

**Last Updated:** October 20, 2025

