""""
    Defines utility functions that would be used across the application.
"""

from typing import List
from fastapi import HTTPException, status
from app.models.user_info import T_UserInfo
from app.models.enums import E_UserRole
from app.schemas.page_content import PageContentResponse

# User Utils
def is_super_admin(current_user: T_UserInfo):
    """
    Check whether user is a super admin.
    """
    if E_UserRole(current_user.UI_Role) != E_UserRole.SuperAdmin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only superadmin can access this route.")
    

def is_admin(current_user: T_UserInfo, detail: str):
    """
    Check whether user is a super admin.
    """
    if E_UserRole(current_user.UI_Role) not in [E_UserRole.SuperAdmin, E_UserRole.Admin]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    
# Page Utils

def check_page_permission(page_accessible_to: List[E_UserRole] , user_role: E_UserRole):
    """
    Check page permission.
    """
    if user_role not in page_accessible_to:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="You are not authorized to access this page.")


