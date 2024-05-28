"""
This module contains enumeration classes for various statuses, user roles, and page types.
"""

import enum

class E_Status(enum.Enum):
    """
    Enumeration for user status.
    """

    Active = 0
    Unauthenticated = 1
    Disabled = 2

class E_UserRole(enum.Enum):
    """
    Enumeration for user roles.
    """

    SuperAdmin = 0
    Admin = 1
    Member = 2
    User = 3
    Public = 4

class E_PageType(enum.Enum):
    """
    Enumeration for page types.
    """

    SinglePage = 0
    PageList = 1
    ResList = 2