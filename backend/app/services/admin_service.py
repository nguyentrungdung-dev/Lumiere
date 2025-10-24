"""
Admin service for platform administration logic.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.models.user import User
from app.models.data_source import DataSource
from app.models.conversation import Conversation
from app.models.system import AuditTrail
from app.core.utils import mask_email, mask_phone, calculate_storage_size
from app.schemas.admin import (
    UserListItem, UserDetail, ActivityItem, PlatformStats,
    SystemHealth, UserGrowthData
)


class AdminService:
    """Service class for admin operations."""
    
    @staticmethod
    def get_platform_stats(db: Session) -> PlatformStats:
        """
        Get platform-wide statistics.
        
        Args:
            db: Database session
            
        Returns:
            Platform statistics
        """
        # Current counts
        total_users = db.query(User).filter(User.is_admin == False).count()
        total_data_sources = db.query(DataSource).count()
        total_conversations = db.query(Conversation).count()
        
        # Calculate total storage (mock for now - TODO: implement real calculation)
        total_storage_bytes = 523456789000  # ~487 GB
        total_storage = calculate_storage_size(total_storage_bytes)
        
        # Calculate growth (last 30 days vs previous 30 days)
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)
        
        # User growth
        users_last_30 = db.query(User).filter(
            User.created_at >= thirty_days_ago,
            User.is_admin == False
        ).count()
        users_prev_30 = db.query(User).filter(
            User.created_at >= sixty_days_ago,
            User.created_at < thirty_days_ago,
            User.is_admin == False
        ).count()
        user_growth = ((users_last_30 - users_prev_30) / users_prev_30 * 100) if users_prev_30 > 0 else 0
        
        # Data source growth
        ds_last_30 = db.query(DataSource).filter(
            DataSource.created_at >= thirty_days_ago
        ).count()
        ds_prev_30 = db.query(DataSource).filter(
            DataSource.created_at >= sixty_days_ago,
            DataSource.created_at < thirty_days_ago
        ).count()
        ds_growth = ((ds_last_30 - ds_prev_30) / ds_prev_30 * 100) if ds_prev_30 > 0 else 0
        
        # Conversation growth
        conv_last_30 = db.query(Conversation).filter(
            Conversation.created_at >= thirty_days_ago
        ).count()
        conv_prev_30 = db.query(Conversation).filter(
            Conversation.created_at >= sixty_days_ago,
            Conversation.created_at < thirty_days_ago
        ).count()
        conv_growth = ((conv_last_30 - conv_prev_30) / conv_prev_30 * 100) if conv_prev_30 > 0 else 0
        
        # Storage growth (mock)
        storage_growth = 6.2
        
        return PlatformStats(
            total_users=total_users,
            total_data_sources=total_data_sources,
            total_conversations=total_conversations,
            total_storage=total_storage,
            user_growth=round(user_growth, 1),
            data_source_growth=round(ds_growth, 1),
            conversation_growth=round(conv_growth, 1),
            storage_growth=storage_growth
        )
    
    @staticmethod
    def get_users_list(
        db: Session,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Tuple[List[UserListItem], int]:
        """
        Get paginated list of users with masked data.
        
        Args:
            db: Database session
            page: Page number (1-indexed)
            page_size: Items per page
            search: Search query (username or email)
            is_active: Filter by active status
            
        Returns:
            Tuple of (users list, total count)
        """
        # Base query - exclude admins
        query = db.query(User).filter(User.is_admin == False)
        
        # Apply filters
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (User.username.ilike(search_filter)) |
                (User.email.ilike(search_filter))
            )
        
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        users = query.order_by(desc(User.created_at)).offset(offset).limit(page_size).all()
        
        # Convert to response schema with masked data
        user_items = []
        for user in users:
            # Get user statistics
            ds_count = db.query(DataSource).filter(DataSource.owner_id == user.id).count()
            conv_count = db.query(Conversation).filter(Conversation.user_id == user.id).count()
            
            user_item = UserListItem(
                id=user.id,
                username=user.username,
                email=mask_email(user.email),  # Masked
                phone=mask_phone(user.phone) if user.phone else None,  # Masked
                full_name=user.full_name,
                is_active=user.is_active,
                is_admin=user.is_admin,
                created_at=user.created_at,
                last_login_at=user.last_login_at,
                data_sources_count=ds_count,
                conversations_count=conv_count
            )
            user_items.append(user_item)
        
        return user_items, total
    
    @staticmethod
    def get_user_detail(db: Session, user_id: int) -> Optional[UserDetail]:
        """
        Get detailed user information.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User detail or None if not found
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        # Get statistics
        ds_count = db.query(DataSource).filter(DataSource.owner_id == user.id).count()
        conv_count = db.query(Conversation).filter(Conversation.user_id == user.id).count()
        queries_count = 0  # TODO: implement when Query model is used
        total_storage = "0 B"  # TODO: implement real calculation
        
        return UserDetail(
            id=user.id,
            username=user.username,
            email=mask_email(user.email),  # Masked
            phone=mask_phone(user.phone) if user.phone else None,  # Masked
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            locale=user.locale,
            is_active=user.is_active,
            is_admin=user.is_admin,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login_at=user.last_login_at,
            data_sources_count=ds_count,
            conversations_count=conv_count,
            queries_count=queries_count,
            total_storage=total_storage
        )
    
    @staticmethod
    def update_user_status(db: Session, user_id: int, is_active: bool) -> bool:
        """
        Update user active status (enable/disable).
        
        Args:
            db: Database session
            user_id: User ID
            is_active: New active status
            
        Returns:
            True if updated, False if user not found
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        user.is_active = is_active
        user.updated_at = datetime.utcnow()
        db.commit()
        
        # TODO: Log this action in audit trail
        
        return True
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """
        Delete a user and all associated data.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            True if deleted, False if user not found
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user or user.is_admin:  # Prevent deleting admin users
            return False
        
        # Delete user (cascade will handle related data)
        db.delete(user)
        db.commit()
        
        # TODO: Log this action in audit trail
        
        return True
    
    @staticmethod
    def get_activity_feed(
        db: Session,
        page: int = 1,
        page_size: int = 20,
        activity_type: Optional[str] = None
    ) -> Tuple[List[ActivityItem], int]:
        """
        Get recent platform activity feed.
        
        Args:
            db: Database session
            page: Page number
            page_size: Items per page
            activity_type: Filter by activity type
            
        Returns:
            Tuple of (activities list, total count)
        """
        # Query audit trail for activities
        query = db.query(AuditTrail)
        
        if activity_type:
            query = query.filter(AuditTrail.action.ilike(f"%{activity_type}%"))
        
        total = query.count()
        
        offset = (page - 1) * page_size
        activities_db = query.order_by(desc(AuditTrail.created_at)).offset(offset).limit(page_size).all()
        
        # Convert to activity items
        activities = []
        for activity in activities_db:
            # Determine activity type
            action = activity.action.lower()
            if 'register' in action or 'signup' in action:
                activity_type = 'user_register'
                description = f"New user registered: {activity.details.get('username', 'Unknown')}" if activity.details else "New user registered"
            elif 'upload' in action or 'create' in action and 'data' in action:
                activity_type = 'data_upload'
                description = f"User {activity.details.get('username', 'Unknown')} uploaded data" if activity.details else "Data uploaded"
            else:
                activity_type = 'system'
                description = activity.action
            
            activity_item = ActivityItem(
                id=activity.id,
                type=activity_type,
                description=description,
                user_id=activity.user_id,
                username=activity.details.get('username') if activity.details else None,
                timestamp=activity.created_at,
                metadata=activity.details
            )
            activities.append(activity_item)
        
        return activities, total
    
    @staticmethod
    def get_system_health(db: Session) -> SystemHealth:
        """
        Get system health metrics.
        
        Args:
            db: Database session
            
        Returns:
            System health information
        """
        # Check database connectivity
        try:
            db.execute("SELECT 1")
            db_status = "healthy"
        except:
            db_status = "down"
        
        # TODO: Implement real metrics
        # For now, return mock data
        return SystemHealth(
            api_status="healthy",
            database_status=db_status,
            error_rate="0.02%",
            avg_response_time="245ms",
            uptime="99.98%",
            last_backup=datetime.utcnow() - timedelta(hours=6),
            disk_usage="45%"
        )
    
    @staticmethod
    def get_user_growth_data(
        db: Session,
        period: str = "month",
        days: int = 30
    ) -> List[UserGrowthData]:
        """
        Get user growth data for analytics charts.
        
        Args:
            db: Database session
            period: 'day', 'week', or 'month'
            days: Number of days to include
            
        Returns:
            List of user growth data points
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Group by date
        growth_data = db.query(
            func.date(User.created_at).label('date'),
            func.count(User.id).label('new_users')
        ).filter(
            User.created_at >= start_date,
            User.created_at <= end_date,
            User.is_admin == False
        ).group_by(
            func.date(User.created_at)
        ).order_by('date').all()
        
        # Convert to response format
        result = []
        cumulative_count = db.query(User).filter(
            User.created_at < start_date,
            User.is_admin == False
        ).count()
        
        for date, new_users in growth_data:
            cumulative_count += new_users
            result.append(UserGrowthData(
                date=date.strftime('%Y-%m-%d'),
                count=cumulative_count,
                new_users=new_users
            ))
        
        return result

