"""
Utility functions for the application.
"""
import re
from typing import Optional


def mask_email(email: Optional[str]) -> Optional[str]:
    """
    Mask email address for privacy.
    Example: john@gmail.com -> joh***@***il.com
    
    Args:
        email: Email address to mask
        
    Returns:
        Masked email or None if input is None
    """
    if not email:
        return None
    
    try:
        local, domain = email.split('@')
        domain_name, domain_ext = domain.rsplit('.', 1)
        
        # Mask local part (keep first 3 chars or less)
        masked_local = local[:3] + '***' if len(local) > 3 else local + '***'
        
        # Mask domain name (keep first 1 and last 2 chars, or less)
        if len(domain_name) > 3:
            masked_domain = '***' + domain_name[-2:]
        else:
            masked_domain = '***'
        
        return f"{masked_local}@{masked_domain}.{domain_ext}"
    except:
        # If email format is invalid, return masked version
        return "***@***.***"


def mask_phone(phone: Optional[str]) -> Optional[str]:
    """
    Mask phone number for privacy.
    Example: 1234567891 -> 123*******1
    
    Args:
        phone: Phone number to mask
        
    Returns:
        Masked phone or None if input is None
    """
    if not phone:
        return None
    
    # Remove non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    if len(digits) < 4:
        return '***'
    
    # Keep first 3 and last 1 digit
    masked = digits[:3] + '*' * (len(digits) - 4) + digits[-1:]
    
    return masked


def mask_address(address: Optional[str]) -> Optional[str]:
    """
    Mask address for privacy.
    Just return hidden message.
    
    Args:
        address: Address to mask
        
    Returns:
        Masked address or None if input is None
    """
    if not address:
        return None
    
    return "[Hidden for privacy]"


def calculate_storage_size(size_bytes: int) -> str:
    """
    Convert bytes to human-readable format.
    
    Args:
        size_bytes: Size in bytes
        
    Returns:
        Human-readable size string (e.g., "1.5 GB")
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"


def format_percentage(value: float) -> str:
    """
    Format percentage value.
    
    Args:
        value: Percentage value (e.g., 12.5)
        
    Returns:
        Formatted percentage string (e.g., "+12.5%")
    """
    sign = '+' if value > 0 else ''
    return f"{sign}{value:.1f}%"

