# Lumiere - Database Schema

## Overview
This document contains the complete database schema for the Lumiere project, including all tables, relationships, and constraints.

---

## 📊 Table Groups

### 1. Authentication & Authorization (6 tables)
- `users` - Core user accounts
- `roles` - User roles (admin, user, etc.)
- `user_roles` - Many-to-many relationship between users and roles
- `api_keys` - API key management for programmatic access
- `password_resets` - Password reset tokens
- `audit_trails` - Audit log for all actions

### 2. Data Sources (2 tables)
- `data_sources` - External database connections and CSV uploads
- `data_source_configs` - Additional configuration key-value pairs

### 3. Query Management (4 tables)
- `queries` - Natural language queries and generated SQL
- `query_history` - History of query actions
- `query_results` - Stored query results
- `query_metrics` - Performance and cost metrics

### 4. AI & Agents (3 tables)
- `agents` - AI agents (SQL Agent, Insight Agent, etc.)
- `agent_runs` - Individual agent execution records
- `orchestrator_runs` - Multi-agent orchestration runs

### 5. Conversations & Chat (3 tables)
- `conversations` - Chat sessions
- `conversation_messages` - Individual messages
- `conversation_memory` - Conversation context and memory

### 6. RAG & Embeddings (3 tables)
- `rag_documents` - Documents for retrieval
- `embeddings` - Vector embeddings for semantic search
- `retrieval_sessions` - Track which documents were retrieved

### 7. Insights & Analysis (2 tables)
- `insights` - AI-generated insights
- `prompt_templates` - Reusable prompt templates

### 8. Visualization (3 tables)
- `dashboards` - Dashboard containers
- `dashboard_shares` - Dashboard sharing permissions
- `charts` - Individual chart configurations

### 9. Workspaces (2 tables)
- `workspaces` - User workspaces
- `workspace_items` - Items within workspaces

### 10. Exports & Reports (2 tables)
- `exports` - Export jobs (PDF, CSV, etc.)
- `scheduled_reports` - Scheduled report definitions

### 11. System & Monitoring (5 tables)
- `system_logs` - System-wide logs
- `notifications` - User notifications
- `usage_costs` - Cost tracking
- `alerts` - Alert configurations
- `business_glossary` - Business term definitions

---

## 🗃️ Complete Schema

```sql
CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "full_name" varchar,
  "avatar_url" varchar,
  "locale" varchar,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp,
  "last_login_at" timestamp
);

CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "user_roles" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "role_id" integer NOT NULL,
  "assigned_by" integer,
  "assigned_at" timestamp
);

CREATE TABLE "api_keys" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "key_hash" varchar NOT NULL,
  "name" varchar,
  "allowed_ips" text,
  "scopes" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp,
  "revoked_at" timestamp
);

CREATE TABLE "data_sources" (
  "id" integer PRIMARY KEY,
  "name" varchar NOT NULL,
  "type" varchar,
  "host" varchar,
  "port" integer,
  "database_name" varchar,
  "username" varchar,
  "password_encrypted" text,
  "connection_string" text,
  "ssl_mode" varchar,
  "owner_user_id" integer,
  "created_at" timestamp,
  "updated_at" timestamp,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "data_source_configs" (
  "id" integer PRIMARY KEY,
  "data_source_id" integer NOT NULL,
  "key" varchar,
  "value" text,
  "created_at" timestamp
);

CREATE TABLE "queries" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "workspace_id" integer,
  "natural_language" text,
  "generated_sql" text,
  "engine" varchar,
  "data_source_id" integer,
  "status" varchar DEFAULT 'pending',
  "started_at" timestamp,
  "finished_at" timestamp,
  "error_message" text,
  "created_at" timestamp,
  "executed_rows" bigint,
  "execution_time_ms" integer
);

CREATE TABLE "query_history" (
  "id" integer PRIMARY KEY,
  "query_id" integer NOT NULL,
  "user_id" integer,
  "action" varchar,
  "details" text,
  "created_at" timestamp
);

CREATE TABLE "query_results" (
  "id" integer PRIMARY KEY,
  "query_id" integer NOT NULL,
  "result_location" varchar,
  "result_meta" json,
  "created_at" timestamp
);

CREATE TABLE "query_metrics" (
  "id" integer PRIMARY KEY,
  "query_id" integer,
  "cpu_ms" integer,
  "memory_mb" integer,
  "api_calls" integer,
  "token_usage" integer,
  "cost" decimal,
  "recorded_at" timestamp
);

CREATE TABLE "agents" (
  "id" integer PRIMARY KEY,
  "name" varchar NOT NULL,
  "type" varchar,
  "config" json,
  "created_at" timestamp,
  "updated_at" timestamp,
  "is_active" boolean
);

CREATE TABLE "agent_runs" (
  "id" integer PRIMARY KEY,
  "agent_id" integer NOT NULL,
  "query_id" integer,
  "orchestrator_run_id" integer,
  "status" varchar DEFAULT 'pending',
  "input" json,
  "output" json,
  "started_at" timestamp,
  "finished_at" timestamp,
  "error_text" text
);

CREATE TABLE "orchestrator_runs" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "name" varchar,
  "description" text,
  "input_spec" json,
  "result_summary" text,
  "status" varchar DEFAULT 'pending',
  "created_at" timestamp,
  "started_at" timestamp,
  "finished_at" timestamp
);

CREATE TABLE "conversations" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "title" varchar,
  "language" varchar,
  "session_state" json,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp,
  "last_message_at" timestamp
);

CREATE TABLE "conversation_messages" (
  "id" integer PRIMARY KEY,
  "conversation_id" integer NOT NULL,
  "sender" varchar,
  "role" varchar,
  "message_text" text,
  "message_meta" json,
  "created_at" timestamp,
  "token_count" integer,
  "source_ids" json
);

CREATE TABLE "conversation_memory" (
  "id" integer PRIMARY KEY,
  "conversation_id" integer NOT NULL,
  "memory_type" varchar,
  "key" varchar,
  "value" text,
  "relevance_score" float,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "rag_documents" (
  "id" integer PRIMARY KEY,
  "datasource_id" integer,
  "title" varchar,
  "content" text,
  "content_hash" varchar,
  "metadata" json,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "embeddings" (
  "id" integer PRIMARY KEY,
  "document_id" integer,
  "vector" json,
  "model" varchar,
  "created_at" timestamp
);

CREATE TABLE "retrieval_sessions" (
  "id" integer PRIMARY KEY,
  "conversation_id" integer,
  "query_id" integer,
  "retrieved_doc_ids" json,
  "created_at" timestamp
);

CREATE TABLE "prompt_templates" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text,
  "template" text,
  "variables" json,
  "created_by" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "insights" (
  "id" integer PRIMARY KEY,
  "query_id" integer,
  "conversation_id" integer,
  "author_agent_id" integer,
  "title" varchar,
  "content" text,
  "insight_type" varchar,
  "confidence_score" float,
  "created_at" timestamp
);

CREATE TABLE "dashboards" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "name" varchar,
  "description" text,
  "is_public" boolean DEFAULT false,
  "layout" json,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "dashboard_shares" (
  "id" integer PRIMARY KEY,
  "dashboard_id" integer,
  "shared_to_user_id" integer,
  "shared_to_role_id" integer,
  "permission" varchar,
  "shared_at" timestamp
);

CREATE TABLE "charts" (
  "id" integer PRIMARY KEY,
  "dashboard_id" integer,
  "query_id" integer,
  "name" varchar,
  "type" varchar,
  "config" json,
  "thumbnail_url" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "workspaces" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "workspace_items" (
  "id" integer PRIMARY KEY,
  "workspace_id" integer NOT NULL,
  "item_type" varchar,
  "item_id" integer,
  "position" json,
  "created_at" timestamp
);

CREATE TABLE "exports" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "dashboard_id" integer,
  "chart_id" integer,
  "query_id" integer,
  "format" varchar,
  "file_location" varchar,
  "status" varchar,
  "created_at" timestamp,
  "completed_at" timestamp
);

CREATE TABLE "scheduled_reports" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "name" varchar,
  "cron_expr" varchar,
  "payload" json,
  "last_run_at" timestamp,
  "next_run_at" timestamp,
  "is_active" boolean,
  "created_at" timestamp
);

CREATE TABLE "business_glossary" (
  "id" integer PRIMARY KEY,
  "term" varchar UNIQUE NOT NULL,
  "definition" text,
  "formula" text,
  "examples" text,
  "created_by" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "system_logs" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "level" varchar,
  "component" varchar,
  "action" varchar,
  "details" text,
  "ip_address" varchar,
  "created_at" timestamp
);

CREATE TABLE "notifications" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "title" varchar,
  "body" text,
  "channel" varchar,
  "status" varchar,
  "meta" json,
  "created_at" timestamp,
  "sent_at" timestamp
);

CREATE TABLE "usage_costs" (
  "id" integer PRIMARY KEY,
  "metric" varchar NOT NULL,
  "value" decimal,
  "unit" varchar,
  "recorded_at" timestamp,
  "created_at" timestamp,
  "system_log_id" integer
);

CREATE TABLE "alerts" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "name" varchar,
  "condition" json,
  "severity" varchar,
  "notification_channel" varchar,
  "is_active" boolean,
  "last_triggered_at" timestamp,
  "created_at" timestamp
);

CREATE TABLE "password_resets" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "reset_token_hash" varchar,
  "expires_at" timestamp,
  "created_at" timestamp,
  "used_at" timestamp
);

CREATE TABLE "audit_trails" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "action" varchar,
  "object_type" varchar,
  "object_id" integer,
  "diff" json,
  "created_at" timestamp
);
```

---

## 🔗 Relationships

### Users & Authentication
- `user_roles.user_id` → `users.id`
- `user_roles.role_id` → `roles.id`
- `api_keys.user_id` → `users.id`
- `password_resets.user_id` → `users.id`
- `audit_trails.user_id` → `users.id`

### Data Sources
- `data_sources.owner_user_id` → `users.id`
- `data_source_configs.data_source_id` → `data_sources.id`

### Queries
- `queries.user_id` → `users.id`
- `queries.workspace_id` → `workspaces.id`
- `queries.data_source_id` → `data_sources.id`
- `query_history.query_id` → `queries.id`
- `query_results.query_id` → `queries.id`
- `query_metrics.query_id` → `queries.id`

### AI & Agents
- `agent_runs.agent_id` → `agents.id`
- `agent_runs.query_id` → `queries.id`
- `agent_runs.orchestrator_run_id` → `orchestrator_runs.id`
- `orchestrator_runs.user_id` → `users.id`

### Conversations
- `conversations.user_id` → `users.id`
- `conversation_messages.conversation_id` → `conversations.id`
- `conversation_memory.conversation_id` → `conversations.id`

### RAG & Embeddings
- `rag_documents.datasource_id` → `data_sources.id`
- `embeddings.document_id` → `rag_documents.id`
- `retrieval_sessions.conversation_id` → `conversations.id`
- `retrieval_sessions.query_id` → `queries.id`

### Insights
- `insights.query_id` → `queries.id`
- `insights.conversation_id` → `conversations.id`
- `insights.author_agent_id` → `agents.id`
- `prompt_templates.created_by` → `users.id`

### Dashboards & Charts
- `dashboards.user_id` → `users.id`
- `dashboard_shares.dashboard_id` → `dashboards.id`
- `dashboard_shares.shared_to_user_id` → `users.id`
- `dashboard_shares.shared_to_role_id` → `roles.id`
- `charts.dashboard_id` → `dashboards.id`
- `charts.query_id` → `queries.id`

### Workspaces
- `workspaces.user_id` → `users.id`
- `workspace_items.workspace_id` → `workspaces.id`

### Exports & Reports
- `exports.user_id` → `users.id`
- `exports.dashboard_id` → `dashboards.id`
- `exports.chart_id` → `charts.id`
- `exports.query_id` → `queries.id`
- `scheduled_reports.user_id` → `users.id`

### System & Monitoring
- `business_glossary.created_by` → `users.id`
- `system_logs.user_id` → `users.id`
- `notifications.user_id` → `users.id`
- `usage_costs.system_log_id` → `system_logs.id`
- `alerts.user_id` → `users.id`

---

## 📝 Column Comments & Notes

### users
- `locale` - User preferred language (e.g., vi, en)

### api_keys
- `scopes` - Comma-separated scopes

### data_sources
- `type` - PostgreSQL, MySQL, BigQuery, ERP, CRM, S3, etc.
- `password_encrypted` - Encrypted credentials
- `connection_string` - Optional full DSN

### queries
- `natural_language` - Original NL input
- `engine` - Which agent/model generated SQL
- `data_source_id` - Which datasource executed on
- `status` - pending, running, success, failed

### query_history
- `action` - created, executed, edited, saved, shared

### query_results
- `result_location` - URL or object storage path

### query_metrics
- `cost` - Monetary cost for the query

### agents
- `name` - SQL Agent, Insight Agent, Visualization Agent

### conversations
- `language` - Conversation language
- `session_state` - Short-lived session context

### conversation_messages
- `sender` - user, assistant, system, agent
- `role` - Optional role like assistant/insight_agent
- `message_meta` - e.g., embedding_id, attachments
- `source_ids` - References to RAG source docs

### conversation_memory
- `memory_type` - short_term, long_term, user_pref

### embeddings
- `vector` - Depends on DB support (JSON placeholder)

### insights
- `insight_type` - trend, anomaly, explanation

### dashboards
- `layout` - Positions, grid settings

### dashboard_shares
- `permission` - view, edit, manage

### charts
- `type` - bar, line, pie, table, custom
- `config` - Chart settings, filters, drill-down

### workspace_items
- `item_type` - query, dashboard, chart, insight

### exports
- `format` - pdf, xlsx, png, csv

### system_logs
- `level` - info, warn, error, audit

### notifications
- `channel` - email, in-app, webhook
- `status` - sent, failed, read, unread

### usage_costs
- `metric` - query_time, token_usage, storage, model_api_calls

### alerts
- `condition` - JSON rule to evaluate

---

## 🎯 Design Patterns Used

1. **Soft Deletes** - Using `is_active` flags
2. **Audit Trails** - Comprehensive audit_trails table
3. **Timestamps** - created_at, updated_at on most tables
4. **JSON Storage** - For flexible configs and metadata
5. **Many-to-Many** - user_roles as junction table
6. **Polymorphic Relations** - workspace_items.item_type
7. **Status Tracking** - Status columns for async operations

---

**Total Tables:** 39  
**Last Updated:** October 20, 2025

