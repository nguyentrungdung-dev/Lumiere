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
- [x] Create initial migration
- [x] Test database connection

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
- [x] Initialize Vite + React + TypeScript
- [x] Install dependencies (React Router, Axios, TailwindCSS)
- [x] Configure TypeScript (tsconfig.json)
- [x] Set up API service layer (`services/userApi.ts`)
- [x] Configure environment variables

#### 1.6 Authentication UI
- [x] `UserLoginPage.tsx` - Login form with validation
- [x] `UserRegisterPage.tsx` - Registration form
- [x] Auth context/hook for managing user state
- [x] Protected route wrapper component
- [x] Token storage (localStorage + axios interceptors)
- [x] Error handling and display

#### 1.7 Layout & Navigation
- [x] `UserLayout.tsx` - Main app layout with sidebar/navbar
- [x] `UserDashboardPage.tsx` - Landing page after login
- [x] Routing setup (React Router v6)
- [x] Navigation menu component
- [x] User profile dropdown

### Deliverable
✅ **PHASE 1 COMPLETE** - Users can register, login, and see a basic dashboard.

### 📝 Note on Admin Module
**Built Early (out of order):** Admin Portal (both backend & frontend) was completed early for monitoring purposes. This is technically part of Phase 3, but has been moved ahead of schedule.

---

## **PHASE 2: Core Data & AI Features** 🤖

### Backend Tasks

#### 2.1 Data Upload Module
- [x] POST `/data/upload` - CSV file upload endpoint
- [x] File parser (parse CSV → store in temp table or user schema)
- [x] GET `/data/sources` - List all data sources
- [x] GET `/data/source/{id}` - Get specific data source
- [x] PATCH `/data/source/{id}` - Update data source
- [x] DELETE `/data/source/{id}` - Delete data source
- [x] GET `/data/source/{id}/preview` - Preview data with pagination
- [x] Service for managing data source metadata
- [x] File size and format validation (50MB max)

#### 2.2 Database Connector (Optional for Phase 2)
- [ ] POST `/data/connect` - Connect to external PostgreSQL/MySQL
- [ ] Validate database connection
- [ ] Fetch schema information
- [ ] Test connection endpoint

#### 2.3 AI Query Module
- [x] POST `/ai/query` - Generate SQL from natural language
- [x] LLM integration (OpenAI GPT-4o-mini)
- [x] SQL execution on user data (using pandasql)
- [x] Return structured results
- [x] Error handling for invalid SQL
- [x] Query validation and sanitization
- [x] Store query history
- [x] GET `/ai/queries` - Get query history with pagination
- [x] GET `/ai/query/{id}` - Get query details
- [x] POST `/ai/query/{id}/rerun` - Re-run previous query
- [x] DELETE `/ai/query/{id}` - Delete query from history

#### 2.4 Chart Generation Module
- [x] POST `/ai/chart` - Analyze SQL results and suggest chart type
- [x] Generate Chart.js compatible configuration
- [x] Return chart config JSON
- [x] Support multiple chart types (bar, line, pie, scatter, doughnut, area)
- [x] LLM-powered chart type selection
- [x] Automatic color and styling suggestions

#### 2.5 Insight Generation Module
- [x] POST `/ai/insight` - Generate insights from data
- [x] Summarization using LLM (GPT-4o-mini)
- [x] Business-focused recommendations
- [x] Link insights to queries
- [x] Key findings extraction

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
- [x] `DataSourcesPage.tsx` - CSV upload with drag-and-drop
- [x] `FileUpload.tsx` - Drag-and-drop upload component with react-dropzone
- [x] `DataSourceCard.tsx` - Display data source cards
- [x] `DataPreviewModal.tsx` - Preview data with pagination
- [x] File validation (size, format)
- [x] Upload progress indicator
- [x] Success/error notifications

#### 2.9 AI Query Interface
- [x] `AIQueryPage.tsx` - Main analysis interface
- [x] `QueryInterface.tsx` - Natural language input with data source selector
- [x] `QueryResults.tsx` - Display generated SQL with syntax highlighting
- [x] Show query results in table format
- [x] Loading states and animations
- [x] Error handling and display

#### 2.10 Chart Visualization
- [x] `ChartsPage.tsx` - Chart display page
- [x] `ChartRenderer.tsx` - Render charts using Recharts
- [x] Support bar, line, pie, scatter, doughnut, area charts
- [x] AI reasoning display
- [x] Chart information panel
- [x] Responsive chart sizing

#### 2.11 Insight Display
- [x] `InsightsPage.tsx` - Show AI-generated insights
- [x] Key findings display with numbered list
- [x] Recommendations panel
- [x] Copy insights to clipboard
- [x] Navigation to related queries

#### 2.12 Query History
- [x] `QueryHistory.tsx` - List previous queries in sidebar
- [x] Re-run past queries
- [x] Delete queries
- [x] Select query to view details
- [x] Real-time status updates

#### 2.13 Navigation & Routes
- [x] Updated `UserSidebar.tsx` with Phase 2 links
- [x] Added routes in `App.tsx` for all Phase 2 pages
- [x] Created API service layer (`dataApi.ts`)
- [x] Added TypeScript types for all new data structures

### Deliverable
✅ **PHASE 2 FRONTEND COMPLETE** - Users can upload CSV, ask questions, get SQL queries, see charts, and read insights.

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

- [x] **Phase 1 Complete** - Date: October 24, 2024
- [x] **Phase 2 Backend Complete** - Date: October 24, 2024
- [x] **Phase 2 Frontend Complete** - Date: November 3, 2025
- [x] **Phase 2 FULLY COMPLETE** ✅
- [ ] **Phase 3 In Progress** - (Admin Module completed early on Oct 23-24)
- [ ] **Phase 3 Complete** - Date: ___________

---

## 🔗 Related Documents

- [CONTEXT.md](./CONTEXT.md) - Project overview
- [API_SPEC.md](./API_SPEC.md) - API endpoints specification
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Coding standards
- [AI_LAYER.md](./AI_LAYER.md) - AI architecture details

---

**Last Updated:** November 3, 2025

