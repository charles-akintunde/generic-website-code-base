""""
    Defines utility functions that would be used across the application.
"""

from typing import List, Optional
from urllib.parse import urlparse
from fastapi import HTTPException, status
from app.models.user_info import T_UserInfo
from app.models.enums import E_PageType, E_UserRole
from app.schemas.page_content import PageContentResponse
from app.utils.response import error_response

# User Utils
def is_super_admin(current_user: T_UserInfo):
    """
    Check whether user is a super admin.
    """
    if E_UserRole.SuperAdmin not in current_user.UI_Role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only superadmin can access this route.")
    

def is_admin(current_user: T_UserInfo, detail: str):
    """
    Check whether user is a super admin.
    """
    if  E_UserRole.SuperAdmin not in current_user.UI_Role and  E_UserRole.Admin not in current_user.UI_Role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    
# Page Utils

def check_page_permission(page_accessible_to: List[E_UserRole] , user_roles: List[E_UserRole]):
    """
    Check page permission.
    """
    for role in user_roles:
        if role in page_accessible_to:
            return 
    raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="You are not authorized to access this page.")


def to_kebab_case(s: str) -> str:
    """
    Convert a string from 'Path Name' format to 'path-name' format.
    
    Args:
        s (str): The input string in 'Path Name' format.
        
    Returns:
        str: The converted string in 'path-name' format.
    """
    # Convert the string to lowercase
    s = s.lower()
    
    # Replace spaces with hyphens
    s = s.replace(' ', '-')
    
    return s

# def handle_empty_string(value: Optional[str]) -> Optional[str]:
#         print(value,"VALUE")
#         return value if value is not None else ""