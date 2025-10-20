"""
Models package initialization.
Import all models here for easy access and Alembic auto-generation.
"""
from app.models.user import User, Role, UserRole, APIKey, PasswordReset
from app.models.data_source import DataSource, DataSourceConfig
from app.models.query import Query, QueryHistory, QueryResult, QueryMetric
from app.models.agent import Agent, AgentRun, OrchestratorRun
from app.models.conversation import Conversation, ConversationMessage, ConversationMemory
from app.models.rag import RAGDocument, Embedding, RetrievalSession
from app.models.insight import Insight, PromptTemplate
from app.models.dashboard import Dashboard, DashboardShare, Chart
from app.models.workspace import Workspace, WorkspaceItem
from app.models.export import Export, ScheduledReport
from app.models.system import SystemLog, Notification, UsageCost, Alert, BusinessGlossary, AuditTrail

__all__ = [
    # User models
    "User",
    "Role",
    "UserRole",
    "APIKey",
    "PasswordReset",
    # Data source models
    "DataSource",
    "DataSourceConfig",
    # Query models
    "Query",
    "QueryHistory",
    "QueryResult",
    "QueryMetric",
    # Agent models
    "Agent",
    "AgentRun",
    "OrchestratorRun",
    # Conversation models
    "Conversation",
    "ConversationMessage",
    "ConversationMemory",
    # RAG models
    "RAGDocument",
    "Embedding",
    "RetrievalSession",
    # Insight models
    "Insight",
    "PromptTemplate",
    # Dashboard models
    "Dashboard",
    "DashboardShare",
    "Chart",
    # Workspace models
    "Workspace",
    "WorkspaceItem",
    # Export models
    "Export",
    "ScheduledReport",
    # System models
    "SystemLog",
    "Notification",
    "UsageCost",
    "Alert",
    "BusinessGlossary",
    "AuditTrail",
]

