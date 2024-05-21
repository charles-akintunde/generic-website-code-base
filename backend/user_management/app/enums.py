# app/enums.py

import enum

class UserRole(enum.Enum):
    """
    Enum for user roles.

    Attributes:
        ADMIN: Represents an admin user.
        MEMBER: Represents a member user (member of the application).
        USER: Represents a normal user.
    """
    ADMIN = "admin"
    MEMBER = "member"
    USER = "user"
