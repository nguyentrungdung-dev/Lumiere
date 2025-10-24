"""
Script to create an admin user for the Lumiere platform.
Run this script once to create your first admin account.

Usage:
    python create_admin.py --username admin --password your_secure_password
"""
import argparse
import sys
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def create_admin_user(username: str, password: str, email: str = None) -> bool:
    """
    Create an admin user in the database.
    
    Args:
        username: Admin username
        password: Admin password (will be hashed)
        email: Admin email (optional, defaults to admin@lumiere.local)
        
    Returns:
        True if successful, False otherwise
    """
    db: Session = SessionLocal()
    
    try:
        # Check if username already exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"❌ Error: Username '{username}' already exists!")
            if existing_user.is_admin:
                print(f"   User '{username}' is already an admin.")
            else:
                print(f"   To make existing user admin, update database directly.")
            return False
        
        # Check if email already exists
        if email:
            existing_email = db.query(User).filter(User.email == email).first()
            if existing_email:
                print(f"❌ Error: Email '{email}' already exists!")
                return False
        
        # Create admin user
        admin_email = email or f"{username}@lumiere.local"
        admin_user = User(
            username=username,
            email=admin_email,
            password_hash=hash_password(password),
            full_name="Platform Administrator",
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("\n✅ Admin user created successfully!")
        print(f"   Username: {admin_user.username}")
        print(f"   Email: {admin_user.email}")
        print(f"   Admin: {admin_user.is_admin}")
        print(f"   ID: {admin_user.id}")
        print("\n⚠️  IMPORTANT: Save these credentials securely!")
        print(f"   You can now login to /admin/login with these credentials.\n")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error creating admin user: {str(e)}")
        return False
        
    finally:
        db.close()


def main():
    """Main function to parse arguments and create admin user."""
    parser = argparse.ArgumentParser(
        description="Create an admin user for Lumiere platform"
    )
    parser.add_argument(
        "--username",
        type=str,
        required=True,
        help="Admin username"
    )
    parser.add_argument(
        "--password",
        type=str,
        required=True,
        help="Admin password (minimum 8 characters recommended)"
    )
    parser.add_argument(
        "--email",
        type=str,
        default=None,
        help="Admin email (optional, defaults to username@lumiere.local)"
    )
    
    args = parser.parse_args()
    
    # Validate password length
    if len(args.password) < 8:
        print("⚠️  Warning: Password is less than 8 characters. Recommended minimum is 8.")
        confirm = input("Continue anyway? (y/N): ")
        if confirm.lower() != 'y':
            print("Aborted.")
            sys.exit(0)
    
    # Create admin user
    print(f"\n🔧 Creating admin user '{args.username}'...")
    success = create_admin_user(args.username, args.password, args.email)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

