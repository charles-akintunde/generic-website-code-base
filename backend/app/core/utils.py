""""
    Defines utility functions that would be used across the application.
"""

from fastapi import HTTPException, status
from app.models.user_info import T_UserInfo
from app.models.enums import E_UserRole


def is_super_admin(current_user: T_UserInfo):
    """
    Check whether user is a super admin.
    """
    if E_UserRole(current_user.UI_Role) != E_UserRole.SuperAdmin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only superadmin can access this route!.")
    

def is_admin(current_user: T_UserInfo):
    """
    Check whether user is a super admin.
    """
    if E_UserRole(current_user.UI_Role) not in [E_UserRole.SuperAdmin, E_UserRole.Admin]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only admins can access this route!.")
    