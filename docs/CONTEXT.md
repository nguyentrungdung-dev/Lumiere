# Lumiere – Data Analysis for SMEs

## Overview
Lumiere là nền tảng giúp doanh nghiệp vừa và nhỏ (SME) phân tích dữ liệu nhanh chóng bằng AI.  
Người dùng có thể upload file CSV hoặc kết nối DB, sau đó AI tự động:
- Chuyển ngôn ngữ tự nhiên → SQL
- Sinh biểu đồ trực quan
- Phân tích insight tự động
- Quản lý tài khoản và gói dịch vụ

---

## 🧩 Tech Stack
- **Frontend:** ReactJS + TypeScript + Vite
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL
- **AI Layer:** LLM + RAG (for SQL, visualization, insights)
- **Infra:** REST API, JSON schema, async processing

---

## ⚙️ Architecture Overview
Frontend (React + TS)
   ↓ REST API
Backend (FastAPI)
   ↓ ORM (SQLAlchemy)
Database (PostgreSQL)
   ↑
AI Layer (LLM + RAG)
   ↳ Generate SQL, chart configs, and insights

---

## 🚀 Core Modules
1. **Auth Module:** Login, register, user packages
2. **Data Upload Module:** CSV & DB connector
3. **AI Agent Module:** Query → SQL → Chart
4. **Insight Chat Module:** Natural language insights
5. **Admin Module:** Manage users, packages, system metrics

---

## 🧱 Folder Structure
frontend/
  ├── src/
  │   ├── pages/
  │   ├── components/
  │   ├── services/
  │   ├── hooks/
  │   ├── utils/
  │   └── types/
backend/
  ├── app/
  │   ├── routers/
  │   ├── models/
  │   ├── schemas/
  │   ├── services/
  │   └── core/
  └── main.py
ai_layer/
  ├── prompt_templates/
  ├── sql_generation/
  └── insight_analysis/
docs/
  ├── CONTEXT.md
  ├── API_SPEC.md
  ├── STYLE_GUIDE.md
  └── AI_LAYER.md

---

## 🧠 AI Guidelines (for Cursor)
- Always read this file and `/docs/STYLE_GUIDE.md` before coding.
- Follow existing architecture and file conventions.
- Generate clean, modular, and typed code.
- Never create new folders unless explicitly required.

@docs/CONTEXT.md
@docs/API_SPEC.md
@docs/STYLE_GUIDE.md
@docs/AI_LAYER.md

---

## 🧩 Prompt Template Usage Example
Prompt: Using context from /docs/CONTEXT.md and /docs/API_SPEC.md,
create a new FastAPI route for /admin/metrics and connect it with frontend page AdminDashboard.tsx.

---

## ✅ Expected Outcome
- AI hiểu toàn hệ thống
- Code frontend/backend ăn khớp 100%
- Giữ chuẩn naming & logic xuyên suốt project
