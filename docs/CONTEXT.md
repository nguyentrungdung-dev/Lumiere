# Lumiere – Data Analysis Platform for SMEs

## Overview
Lumiere is a **B2B SaaS platform** that helps small and medium enterprises (SMEs) analyze data quickly using AI.  

### **Platform Architecture: Two Portals**

```
┌─────────────────────────────────────────────────┐
│              LUMIERE PLATFORM                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │  ADMIN PORTAL    │    │   USER PORTAL    │  │
│  │  /admin/*        │    │   /app/*         │  │
│  │  (Platform Owner)│    │   (Customers)    │  │
│  └──────────────────┘    └──────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Platform Roles & Access

### **1. ADMIN PORTAL** (`/admin/*`)
**Who:** Platform owner/developer  
**Account:** ONE default system account (no registration)  
**Login:** `/admin/login` (separate endpoint)  
**Credentials:** Stored in backend .env

**Admin Functions:**
- 📊 **Platform Dashboard**
  - Total users (registered customers)
  - Total data sources (across all users)
  - Total conversations (platform-wide)
  - Total storage used (aggregated)
  
- 👥 **User Management**
  - List all customer accounts
  - View user details (privacy-masked)
  - User activity status
  - Enable/disable accounts
  - Delete users
  
- 📈 **Analytics**
  - User growth over time
  - Usage patterns
  - Popular features
  - Revenue metrics
  
- 🔧 **System Health**
  - API status
  - Database status
  - Error rates
  - System uptime
  
- 📋 **Activity Logs**
  - New user registrations
  - Data uploads (who, when, size)
  - System events

**Admin DOES NOT:**
- ❌ Upload CSV/Excel files (user function)
- ❌ Create insights (user function)
- ❌ Chat with AI (user function)
- ❌ Register account (default system account only)

---

### **2. USER PORTAL** (`/app/*`)
**Who:** Small business customers (end users)  
**Accounts:** Multiple accounts (can register)  
**Login:** `/login` (user authentication)  
**Registration:** `/register` (open to customers)

**User Functions:**
- 📁 **Data Upload** - CSV, Excel files
- 💬 **AI Conversations** - Natural language queries
- 💡 **Insights** - AI-generated analysis
- 📊 **Visualizations** - Charts and graphs
- 🤖 **AI Agents** - Custom analysis agents
- 📈 **Query History** - Past analyses
- 👤 **Profile** - Account management
- ⚙️ **Settings** - User preferences

**Data Privacy:**
- Users see ONLY their own data
- Full access to their information
- Can edit all their data

---

## 🧩 Tech Stack
- **Frontend:** ReactJS + TypeScript + Vite
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL
- **AI Layer:** LLM + RAG (for SQL, visualization, insights)
- **Infra:** REST API, JSON schema, async processing

---

## ⚙️ Architecture Overview
```
Frontend (React + TS)
├── Admin Portal (/admin/*)
│   └── Platform management, user oversight
└── User Portal (/app/*)
    └── Data analysis, AI features
    
       ↓ REST API
       
Backend (FastAPI)
├── /admin/* endpoints (platform management)
│   ├── /admin/login
│   ├── /admin/users
│   ├── /admin/analytics
│   └── /admin/system
└── /api/v1/* endpoints (user features)
    ├── /auth (user login/register)
    ├── /data-sources
    ├── /queries
    ├── /conversations
    └── /insights
    
       ↓ ORM (SQLAlchemy)
       
Database (PostgreSQL)
├── Admin queries: Aggregated data across all users
└── User queries: User-specific data only
    
       ↑
       
AI Layer (LLM + RAG)
└── Generate SQL, chart configs, and insights
```

---

## 🚀 Core Modules

### **Admin Modules:**
1. **Admin Auth Module:** Separate admin login
2. **User Management Module:** Customer account oversight
3. **Analytics Module:** Platform metrics & growth
4. **System Health Module:** Monitoring & logs
5. **Settings Module:** Platform configuration

### **User Modules:**
1. **Auth Module:** User login, register, packages
2. **Data Upload Module:** CSV & DB connector
3. **AI Agent Module:** Query → SQL → Chart
4. **Insight Chat Module:** Natural language insights
5. **Profile Module:** User account management

---

## 🧱 Folder Structure

```
frontend/
  ├── src/
  │   ├── pages/
  │   │   ├── admin/              # Admin portal pages
  │   │   │   ├── AdminLoginPage.tsx
  │   │   │   ├── AdminDashboardPage.tsx
  │   │   │   ├── UserManagementPage.tsx
  │   │   │   ├── AnalyticsPage.tsx
  │   │   │   ├── SystemPage.tsx
  │   │   │   └── LogsPage.tsx
  │   │   └── user/               # User portal pages
  │   │       ├── UserLoginPage.tsx
  │   │       ├── UserRegisterPage.tsx
  │   │       ├── UserDashboardPage.tsx
  │   │       ├── DataSourcesPage.tsx
  │   │       ├── ConversationsPage.tsx
  │   │       ├── AgentsPage.tsx
  │   │       ├── InsightsPage.tsx
  │   │       └── UserProfilePage.tsx
  │   ├── components/
  │   │   ├── admin/              # Admin components
  │   │   │   ├── layout/
  │   │   │   ├── dashboard/
  │   │   │   └── users/
  │   │   ├── user/               # User components
  │   │   │   ├── layout/
  │   │   │   ├── dashboard/
  │   │   │   └── data/
  │   │   ├── common/             # Shared components
  │   │   │   ├── Avatar.tsx
  │   │   │   ├── Button.tsx
  │   │   │   ├── Input.tsx
  │   │   │   └── Card.tsx
  │   │   └── auth/
  │   │       ├── UserProtectedRoute.tsx
  │   │       └── AdminProtectedRoute.tsx
  │   ├── context/
  │   │   ├── UserAuthContext.tsx
  │   │   └── AdminAuthContext.tsx
  │   ├── services/
  │   │   ├── adminApi.ts         # Admin API calls
  │   │   └── userApi.ts          # User API calls
  │   ├── hooks/
  │   ├── utils/
  │   └── types/
  │       ├── admin.ts
  │       └── user.ts

backend/
  ├── app/
  │   ├── routers/
  │   │   ├── admin/              # Admin endpoints
  │   │   │   ├── auth.py
  │   │   │   ├── users.py
  │   │   │   ├── analytics.py
  │   │   │   └── system.py
  │   │   └── api/v1/             # User endpoints
  │   │       ├── auth.py
  │   │       ├── data_sources.py
  │   │       ├── queries.py
  │   │       ├── conversations.py
  │   │       └── insights.py
  │   ├── models/                 # Database models
  │   ├── schemas/
  │   │   ├── admin.py
  │   │   └── user.py
  │   ├── services/
  │   │   ├── admin_service.py
  │   │   └── user_service.py
  │   └── core/
  │       ├── config.py
  │       ├── security.py
  │       └── database.py
  └── main.py

ai_layer/
  ├── prompt_templates/
  ├── sql_generation/
  └── insight_analysis/

docs/
  ├── CONTEXT.md
  ├── API_SPEC.md
  ├── STYLE_GUIDE.md
  ├── AI_LAYER.md
  ├── DATABASE_SCHEMA.md
  └── ROADMAP.md
```

---

## 🔐 Authentication & Authorization

### **Admin Authentication:**
```
Endpoint: POST /admin/login
Credentials: Stored in backend .env
- ADMIN_USERNAME=admin
- ADMIN_PASSWORD=hashed_password

No registration - single default account
After login → Redirect to /admin/dashboard
```

### **User Authentication:**
```
Endpoints: 
- POST /api/v1/auth/register (open registration)
- POST /api/v1/auth/login

Multiple accounts allowed
After login → Redirect to /app/dashboard
```

### **Data Privacy Rules:**
```
ADMIN can see:
✅ User basic info (name, email, company)
✅ Aggregated metrics (counts, totals)
✅ Activity logs (who did what, when)
⚠️ MASKED sensitive data:
   - Email: john***@***.com
   - Phone: 098***1
   - Address: City/Country only

USERS can see:
✅ ALL their own data (unmasked)
✅ Only their own records
❌ Cannot see other users' data
```

---

## 🛣️ Routing Structure

```typescript
// Admin Portal
/admin/login              → Admin login page
/admin/dashboard          → Platform overview
/admin/users              → User management
/admin/analytics          → Detailed analytics
/admin/system             → System health & settings
/admin/logs               → Activity logs

// User Portal
/login                    → User login page
/register                 → User registration page
/app/dashboard            → User dashboard
/app/data-sources         → Data upload & management
/app/chat                 → AI conversations
/app/agents               → AI agent management
/app/insights             → Generated insights
/app/profile              → User profile & settings

// Default redirects
/                         → /login (public)
/*                        → /login (unknown routes)
```

---

## 📊 Data Access Patterns

### **Admin Queries (Aggregated):**
```sql
-- Example: Get total users
SELECT COUNT(*) FROM users WHERE is_active = true;

-- Example: Get platform storage
SELECT SUM(file_size) FROM data_sources;

-- Example: Get user list (with privacy masking)
SELECT 
  id,
  username,
  CONCAT(SUBSTRING(email, 1, 3), '***@***.com') as masked_email,
  full_name,
  company,
  created_at,
  is_active
FROM users;
```

### **User Queries (User-specific):**
```sql
-- Example: Get user's data sources
SELECT * FROM data_sources WHERE user_id = :current_user_id;

-- Example: Get user's conversations
SELECT * FROM conversations WHERE user_id = :current_user_id;
```

---

## 🧠 AI Guidelines (for Development)

### **Before Coding:**
- ✅ Always read this CONTEXT.md file
- ✅ Check if feature is for Admin or User portal
- ✅ Follow the correct folder structure
- ✅ Use appropriate API endpoints
- ✅ Apply correct authentication context

### **Coding Standards:**
- ✅ Generate clean, modular, and typed code
- ✅ Follow existing architecture conventions
- ✅ Separate admin and user components clearly
- ✅ Never mix admin and user logic
- ✅ Apply privacy masking for admin views

### **File References:**
```
@docs/CONTEXT.md         → Project architecture
@docs/API_SPEC.md        → API endpoint specifications
@docs/STYLE_GUIDE.md     → Code style guidelines
@docs/AI_LAYER.md        → AI integration details
@docs/DATABASE_SCHEMA.md → Database structure
@docs/ROADMAP.md         → Development phases
```

---

## 🧩 Prompt Template Usage Example

**Admin Feature:**
```
Using context from /docs/CONTEXT.md and /docs/API_SPEC.md,
create the admin user management page at /admin/users that:
1. Lists all users with masked sensitive data
2. Shows user activity status
3. Allows enable/disable user accounts
4. Includes search and filter functionality
```

**User Feature:**
```
Using context from /docs/CONTEXT.md and /docs/API_SPEC.md,
create the user data upload page at /app/data-sources that:
1. Allows CSV/Excel file upload
2. Shows upload progress
3. Validates file format
4. Displays user's uploaded files
```

---

## ✅ Expected Outcomes

- ✅ Clear separation between Admin and User portals
- ✅ Frontend/Backend perfectly aligned
- ✅ Consistent naming & logic throughout project
- ✅ Privacy rules enforced at all layers
- ✅ Scalable architecture for future features
- ✅ AI understands complete system context

---

## 📝 Development Phases

### **Phase 1: Foundation** ✅
- Backend API setup
- Database schema
- User authentication
- Basic frontend structure

### **Phase 2: Admin Portal** (Current)
- Admin authentication
- Platform dashboard
- User management
- System monitoring

### **Phase 3: User Portal - Core Features**
- Data upload interface
- AI conversation module
- Insight generation
- Visualization

### **Phase 4: Advanced Features**
- AI agents
- Advanced analytics
- Notifications
- Integrations

---

*Last Updated: October 22, 2025*  
*Architecture: Dual Portal (Admin + User)*
