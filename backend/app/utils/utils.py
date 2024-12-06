""""
    Defines utility functions that would be used across the application.
"""
from typing import Union, List, Dict, Any
from typing import List, Optional
from urllib.parse import urlparse
from fastapi import HTTPException, status
from app.models.user_info import T_UserInfo
from app.models.enums import E_PageType, E_UserRole
from app.schemas.page_content import PageContentResponse
from app.utils.response import error_response
import shortuuid
from sqlalchemy.orm import Session




TElement = Dict[str, Any]
TDescendant = Union[TElement, Dict[str, str]]

# User Utils
def is_super_admin(current_user: T_UserInfo):
    """
    Check whether user is a super admin.
    """
    if E_UserRole.SuperAdmin not in current_user.UI_Role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only superadmin can access this route.")
    

def is_admin(current_user: T_UserInfo, detail: Optional[str]= "You do not have permission to delete this page"):
    """
    Check whether user is a super admin.
    """
    if  E_UserRole.SuperAdmin not in current_user.UI_Role and  E_UserRole.Admin not in current_user.UI_Role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    
# Page Utils

# def check_page_permission(page_accessible_to: List[E_UserRole] , user_roles: List[E_UserRole]):
#     """
#     Check page permission.
#     """
#     for role in user_roles:
#         if role in page_accessible_to:
#             return 
#     raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, 
#             detail="You are not authorized to access this page.")


def check_user_role(user_roles: List[E_UserRole], roles: List[E_UserRole]):
    """
    Check if the user has the specified role.
    """
    for role in roles:
        if role in user_roles:
            return True
    return False


def check_page_permission(page_accessible_to: List[E_UserRole], user_roles: List[E_UserRole]):
    """
    Check page permission with hierarchical access.
    """
    role_hierarchy = {
        E_UserRole.SuperAdmin: 0, 
        E_UserRole.Admin: 1,
        E_UserRole.Member: 2,
        E_UserRole.User: 3,
        E_UserRole.Alumni: 4,     
        E_UserRole.Public: 5       
    }

    lowest_permissive_role = max(role_hierarchy[role] for role in page_accessible_to)

    for role in user_roles:
        if role_hierarchy[role] <= lowest_permissive_role:
            return  

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="You are not authorized to access this page."
    )


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


def extract_text(element: TDescendant, excerpt: str = '') -> str:
    max_length = 150  

    if len(excerpt) >= max_length:
        return excerpt[:max_length]
    if isinstance(element, str):
        excerpt += ' ' + element
    elif 'text' in element and element['text']:
        excerpt += ' ' + element['text']
    elif 'children' in element and isinstance(element['children'], list):
        for child in element['children']:
            excerpt = extract_text(child, excerpt)
            if len(excerpt) >= max_length:
                break  
    
    return excerpt[:max_length].strip()

def get_excerpt(contents: List[TElement]) -> str:
    excerpt = ''
    if not contents:
        return ''
    max_length = 150  
    if contents:
        for content in contents:
            if content['type'] == 'p' or content['type'].startswith('h'):
                excerpt = extract_text(content, excerpt)
                if len(excerpt) >= max_length:
                    break  
    return excerpt.strip()


def count_words(text: str) -> int:
    return len(text.split())

def estimate_reading_time(page_contents: List[TElement] ) -> int:
    if not page_contents or len(page_contents) == 0:
        return 0

    total_words = 0
    image_count = 0

    reading_speed = 200  
    image_reading_time = 5  

    for content in page_contents:
        if content.get('type') == 'p':
            for child in content.get('children', []):
                if 'text' in child:
                    total_words += count_words(child['text'])
        elif content.get('type') == 'img':
            image_count += len(content.get('children', []))  

    reading_time_minutes = total_words / reading_speed
    image_time_minutes = (image_count * image_reading_time) / 60

    total_reading_time_minutes = reading_time_minutes + image_time_minutes

    return round(total_reading_time_minutes)

def generate_unique_url(db: Session, first_name: str, last_name: str):
    """
    Generate a unique URL based on the user's first and last name.
    If the URL already exists in the database, append a short UUID.

    Args:
        db (Session): Database session.
        first_name (str): User's first name.
        last_name (str): User's last name.

    Returns:
        str: A unique URL.
    """
    shortuuid.set_alphabet("abcdefghijklmnopqrstuvwxyz")
    base_url = f"{first_name.lower()}-{last_name.lower()}".replace(" ", "-")

    existing_url = db.query(T_UserInfo).filter_by(UI_UniqueURL=base_url).first()

    if not existing_url:
        return base_url

    while True:
        short_uuid = shortuuid.ShortUUID().random(length=9).lower()
        unique_url = f"{base_url}-{short_uuid}"

        if not db.query(T_UserInfo).filter_by(UI_UniqueURL=unique_url).first():
            break

    return unique_url