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
    Alumni = 5

class E_PageType(enum.Enum):
    """
    Enumeration for page types.
    """

    SinglePage = 0
    PageList = 1
    ResList = 2

class E_MemberPosition(enum.Enum):
    """
    Enumeration for app memeber type.
    """
    DIRECTOR = 0
    POSTDOC = 1
    PHD = 2
    MASTER = 3
    UNDERGRAD = 4
    PRINCIPAL_INVESTIGATOR = 6
    APPLICANT = 7
    CO_APPLICANT = 8
    RESEARCH_MANAGER = 9
    RESEARCH_ASSISTANT = 10
    RESEARCH_ASSOCIATE = 11


# class E_MemberType(enum.Enum):
#     Alumni = 0,