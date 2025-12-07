"""
Utility functions for the application.
"""
import re
from typing import Optional


def mask_email(email: Optional[str]) -> Optional[str]:
   
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
    
    if not address:
        return None
    
    return "[Hidden for privacy]"


def calculate_storage_size(size_bytes: int) -> str:
    
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"


def format_percentage(value: float) -> str:
    
    sign = '+' if value > 0 else ''
    return f"{sign}{value:.1f}%"

