import {
  UserResponse,
  ICompleteUserResponse,
  IPageContentResponse,
  IUserResponseData,
  Page,
  PagesData,
} from '../types/backendResponseInterfaces';
import {
  IPageList,
  IPage,
  IPageContentItem,
  IPageContentMain,
  IPageMain,
  IUserBase,
  IUserList,
  IUserInfo,
  Notify,
} from '../types/componentInterfaces';
import {
  EMemberPosition,
  EPageType,
  EUserRole,
  EUserStatus,
} from '../types/enums';
import { TDescendant, TElement } from '@udecode/plate-common';
import { MenuProps } from 'antd';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';
import nookies from 'nookies';
import moment from 'moment';
import { Dispatch } from '@reduxjs/toolkit';
import { userApi } from '../api/userApi';
import { pageContentApi } from '../api/pageContentApi';
import { pageApi } from '../api/pageApi';
type MenuItem = Required<MenuProps>['items'][number];

export function formatDateWithZeroTime(date: Date): string {
  return moment(date).format('YYYY-MM-DD 00:00:00.000');
}

export const toKebabCase = (str: string): string => {
  str = str.toLowerCase();
  str = str.replace(/ /g, '-');
  return str;
};

export const toKebabCase2 = (str: string): string => {
  str = str.toLowerCase();
  str = str.replace(/\s+/g, '-');

  return str;
};

export const fromKebabCase = (str: string): string => {
  return decodeURIComponent(
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

export const pageTypeLabels: { [key in EPageType]: string } = {
  [EPageType.SinglePage]: 'Single Page',
  [EPageType.PageList]: 'Page List',
  [EPageType.ResList]: 'Resource Page',
  [EPageType.System]: 'System',
};

export const userRoleLabels: { [key in EUserRole]: string } = {
  [EUserRole.SuperAdmin]: 'Super Admin',
  [EUserRole.Admin]: 'Admin',
  [EUserRole.Member]: 'Member',
  [EUserRole.User]: 'User',
  [EUserRole.Public]: 'Public',
  [EUserRole.Alumni]: 'Alumni',
};

export const userStatusLabels: { [key in EUserStatus]: string } = {
  [EUserStatus.Active]: 'Active',
  [EUserStatus.Unauthenticated]: 'Unauthenticated',
  [EUserStatus.Disabled]: 'Disabled',
};

export const memberPositionLabels: { [key in EMemberPosition]: string } = {
  [EMemberPosition.Director]: 'Director',
  [EMemberPosition.PostDoc]: 'Postdoc',
  [EMemberPosition.Phd]: 'PhD',
  [EMemberPosition.Master]: 'Masters',
  [EMemberPosition.Undergrad]: 'Undergrad',
};

export const roleColors: { [key in EUserRole]: string } = {
  [EUserRole.SuperAdmin]: 'superadmin-badge',
  [EUserRole.Admin]: 'admin-badge',
  [EUserRole.Member]: 'user-badge',
  [EUserRole.User]: 'user-badge',
  [EUserRole.Public]: 'public-badge',
  [EUserRole.Alumni]: 'alumni-badge',
};

export const statusColors: { [key in EUserStatus]: string } = {
  [EUserStatus.Active]: 'active-status',
  [EUserStatus.Unauthenticated]: 'unauthenticated-status',
  [EUserStatus.Disabled]: 'disabled-status',
};

export const positionColors: { [key in EMemberPosition]: string } = {
  [EMemberPosition.Director]: 'director-position',
  [EMemberPosition.PostDoc]: 'postdoc-position',
  [EMemberPosition.Phd]: 'phd-position',
  [EMemberPosition.Master]: 'postdoc-position',
  [EMemberPosition.Undergrad]: 'postdoc-position',
};

export const roleBadgeClasses: { [key in EUserRole]: string } = {
  [EUserRole.SuperAdmin]: 'red',
  [EUserRole.Admin]: 'green',
  [EUserRole.Member]: 'blue',
  [EUserRole.User]: 'blue',
  [EUserRole.Public]: 'gray',
  [EUserRole.Alumni]: 'cyan',
};

export const statusBadgeClasses: { [key in EUserStatus]: string } = {
  [EUserStatus.Active]: 'green',
  [EUserStatus.Unauthenticated]: 'gray',
  [EUserStatus.Disabled]: 'red',
};

export interface DecodedToken {
  sub: string;
  firstname: string;
  lastname: string;
  role: number;
  status: number;
  Id: string;
  exp: number;
}

export const decodeJwt = (token: string) => {
  if (token) {
    return jwtDecode(token) as DecodedToken;
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined') {
    let accessToken = localStorage.getItem('access_token');
    let refreshToken = localStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
  }
  return { accessToken: null, refreshToken: null };
};

export const notifyNoChangesMade = (notify: Notify) => {
  notify('Notice', 'No changes were made to the field items.', 'warning');
};

export const clipCopiedSucessfully = (notify: Notify) => {
  notify('Notice', 'Text copied to clipboard', 'success');
};

export const getPageExcerpt = (contents: TElement[] | null): string => {
  if (!contents || contents.length === 0) {
    return '';
  }

  let excerpt = '';

  const extractText = (element: TDescendant) => {
    if ('text' in element && element.text) {
      excerpt += ' ' + element.text;
    } else if ('children' in element && element.children) {
      // @ts-ignore
      for (let child of element.children) {
        extractText(child);
      }
    }
  };

  if (contents) {
    for (let content of contents) {
      if (content.type === 'p' || content.type.startsWith('h')) {
        extractText(content);
      }
    }
  }

  return excerpt.trim();
};

export function estimateReadingTime(pageContents: TElement[] | null) {
  if (!pageContents || pageContents.length === 0) {
    return 0;
  }

  let totalWords = 0;
  let imageCount = 0;

  const readingSpeed = 200;
  const imageReadingTime = 5;
  pageContents.forEach((content) => {
    if (content.type === 'p') {
      content.children.forEach((child) => {
        if (child.text) {
          // @ts-ignore
          totalWords += countWords(child.text);
        }
      });
    } else if (content.type === 'img') {
      imageCount += content.children.length;
    }
  });

  const readingTimeMinutes = totalWords / readingSpeed;
  const imageTimeMinutes = (imageCount * imageReadingTime) / 60;

  const totalReadingTimeMinutes = readingTimeMinutes + imageTimeMinutes;

  return Math.round(totalReadingTimeMinutes);
}

// Helper function to count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export const isScheduledDateGreaterThanCurrent = (date1: string) => {
  return new Date(date1).getTime() > new Date().getTime();
};

// export const hasPermission = (
//   currentUserRole: string,
//   pagePermission: string[]
// ): boolean => {
//   if (pagePermission == undefined || pagePermission == null) {
//     return false;
//   }
//   return pagePermission.includes(currentUserRole);
// };

export const hasPermission = (
  currentUserRole: string,
  pagePermission: string[]
): boolean => {
  if (!pagePermission) {
    return false;
  }

  const roleHierarchy: Record<string, number> = {
    [EUserRole.SuperAdmin]: 0,
    [EUserRole.Admin]: 1,
    [EUserRole.Member]: 2,
    [EUserRole.User]: 3,
    [EUserRole.Alumni]: 4,
    [EUserRole.Public]: 5,
  };

  const lowestPermissiveRole = Math.max(
    ...pagePermission.map((role) => roleHierarchy[role])
  );

  console.log(currentUserRole, 'roleHierarchy[currentUserRole]');

  return roleHierarchy[currentUserRole] <= lowestPermissiveRole;
};

export const getChangedFields = (
  originalData: any,
  newData: any
): Partial<any> => {
  return Object.keys(newData).reduce((acc, key: any) => {
    if (!_.isEqual(newData[key], originalData[key])) {
      acc[key] = newData[key];
    }
    return acc;
  }, {} as Partial<any>);
};

export const pageNormalizer = (
  page: Page,
  pageContent: IPageContentResponse
) => {
  const normalizedPage: IPageMain = {
    pageId: page.PG_ID,
    pageName: page.PG_Name,
    pagePermission: page.PG_Permission.map(String),
    pageType: String(page.PG_Type),
    pageDisplayURL: pageContent.PG_DisplayURL,
    isHidden: false,
    href: `/${pageContent.PG_DisplayURL}`,
    pageContent: {
      pageContentId: pageContent.PC_ID,
      pageName: page.PG_Name,
      pageType: String(page.PG_Type),
      pageId: pageContent.PG_ID,
      userId: pageContent.UI_ID,
      pageDisplayURL: pageContent.PG_DisplayURL,
      href: `${pageContent.PG_DisplayURL}/${pageContent.PC_DisplayURL}`,
      pageContentDisplayURL: pageContent.PC_DisplayURL,
      pageContentName: pageContent.PC_Title,
      pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
      pageContentResource: pageContent.PC_DisplayURL as string,
      isPageContentHidden: pageContent.PC_IsHidden,
      editorContent: pageContent.PC_Content?.PC_Content,
      pageContentCreatedAt: pageContent.PC_CreatedAt as string,
      creatorFullName: `${pageContent.UI_FirstName} ${pageContent.UI_LastName}`,
      pageContenAssociatedUsers: pageContent.PC_UsersPageContents
        ? pageContent.PC_UsersPageContents.map((pageContent) => ({
            value: pageContent.UI_ID,
            label: pageContent.UI_FullName,
          }))
        : [],
    },
  };

  return normalizedPage;
};

export const transformToUserInfo = (data: ICompleteUserResponse): IUserInfo => {
  // @ts-ignore
  return {
    id: data.UI_ID,
    uiFirstName: data.UI_FirstName,
    uiLastName: data.UI_LastName,
    uiEmail: data.UI_Email,
    uiRole: data.UI_Role.map((role) => String(role)),
    uiStatus: data.UI_Status as EUserStatus,
    uiRegDate: data.UI_RegDate,
    uiPhoto: data.UI_PhotoURL ? data.UI_PhotoURL : null,
    uiCity: data.UI_City,
    uiProvince: data.UI_Province,
    uiCountry: data.UI_Country,
    uiPostalCode: data.UI_PostalCode,
    uiPhoneNumber: data.UI_PhoneNumber,
    uiOrganization: data.UI_Organization,
    uiAbout: data.UI_About?.UI_About,
    uiUserPageContents: normalizeUserPageContents(data.UI_UserPageContents),
  };
};

// const pageContentResponse: IPageContentMain = {
//   pageContentId: pageContent.PC_ID,
//   pageId: pageContent.PG_ID,
//   pageName: response.PG_Name,
//   userId: pageContent.UI_ID,
//   href: `${toKebabCase(response.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
//   pageContentName: pageContent.PC_Title,
//   pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
//   isPageContentHidden: pageContent.PC_IsHidden,
//   pageContentCreatedAt: pageContent.PC_CreatedAt as string,
//   pageContentLastUpdatedAt: pageContent.PC_LastUpdatedAt as string,
//   pageContents:
//     pageContent.PC_Content && pageContent.PC_Content['PC_Content'],
// };
// return pageContentResponse;
// }) as IPageContentMain[]),

export const createPageContentItem = (
  data: any,
  plateEditor: any,
  pageId: string,
  pageType: string,
  pageName: string,
  currentUserId: string,
  href: string
): IPageContentItem => {
  // @ts-ignore
  return {
    pageContentName: data.pageContentName,
    pageContentDisplayImage: data.pageContentDisplayImage,
    isPageContentHidden: data.isPageContentHidden,
    editorContent: plateEditor,
    pageId: pageId,
    pageName: pageName,
    href: href,
    userId: currentUserId,
    pageType: pageType,
  };
};

export const normalizeUserPageContents = (response: any) => {
  const pageContents: IPageContentMain[] | undefined = response?.map(
    (pageContent: any) => {
      return {
        pageContentId: pageContent.PC_ID,
        pageId: pageContent.PG_ID,
        pageContentExcerpt: pageContent.PC_Excerpt,
        pageContentReadingTime: pageContent.PC_ReadingTime,
        pageContentDisplayURL: `/${pageContent.PG_DisplayURL}/${pageContent.PC_DisplayURL}`,
        pageDisplayURL: pageContent.PG_DisplayURL,
        pageName: pageContent.PG_Name,
        userId: pageContent.UI_ID,
        href: `/${pageContent.PG_DisplayURL}/${pageContent.PC_DisplayURL}`,
        pageContentName: pageContent.PC_Title,
        pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
        isPageContentHidden: pageContent.PC_IsHidden,
        pageContentCreatedAt: pageContent.PC_CreatedAt as string,
        pageContentLastUpdatedAt: pageContent.PC_LastUpdatedAt as string,
        editorContent: pageContent.PC_Content?.PC_Content,
      };
    }
  );

  return pageContents;
};

export const normalizeMultiContentPage = (
  response: Page,
  isSinglePage: boolean
): IPageMain => {
  // @ts-ignore
  const pageContents: IPageContentMain[] | undefined =
    response.PG_PageContents?.map((pageContent: any) => {
      return {
        pageContentId: pageContent.PC_ID,
        pageId: pageContent.PG_ID,
        pageContentExcerpt: pageContent.PC_Excerpt,
        pageContentReadingTime: pageContent.PC_ReadingTime,
        pageContentDisplayURL:
          EPageType.SinglePage == String(response.PG_Type)
            ? response.PG_DisplayURL
            : EPageType.ResList == String(response.PG_Type)
              ? `${pageContent.PG_DisplayURL}`
              : EPageType.PageList == String(response.PG_Type)
                ? `/${response.PG_DisplayURL}/${pageContent.PC_DisplayURL}`
                : '',
        pageDisplayURL: response.PG_DisplayURL,
        pageName: response.PG_Name,
        userId: pageContent.UI_ID,
        href:
          EPageType.SinglePage == String(response.PG_Type)
            ? response.PG_DisplayURL
            : EPageType.ResList == String(response.PG_Type)
              ? `${pageContent.PC_DisplayURL}`
              : EPageType.PageList == String(response.PG_Type)
                ? `/${response.PG_DisplayURL}/${pageContent.PC_DisplayURL}`
                : '',
        pageContentName: pageContent.PC_Title,
        pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
        isPageContentHidden: pageContent.PC_IsHidden,
        pageContentCreatedAt: pageContent.PC_CreatedAt as string,
        pageContentLastUpdatedAt: pageContent.PC_LastUpdatedAt as string,
        editorContent: pageContent.PC_Content?.PC_Content,
      };
    });

  return {
    pageId: response.PG_ID,
    pageName: response.PG_Name,
    pagePermission: response.PG_Permission.map((permission: any) =>
      String(permission)
    ),
    pageContents: pageContents,
    pageType: String(response.PG_Type),
    isHidden: false,
    pageDisplayURL: `${response.PG_DisplayURL}`,
    href: `/${response.PG_DisplayURL}`,
  };
};

export const mapPageToIPageMain = (pagesData: PagesData): IPageList => {
  const pages = pagesData.PG_Pages.map((page) => ({
    pageId: page.PG_ID,
    pageName: page.PG_Name,
    pagePermission: page.PG_Permission.map((permission) => String(permission)),
    pageType: String(page.PG_Type),
    isHidden: false,
    href: `/${page.PG_DisplayURL}`,
    pageDisplayURL: `${page.PG_DisplayURL}`,
  }));

  return {
    pages: pages,
    pgTotalPageCount: Number(pagesData.PG_PageCount),
  };
};

export const mapToIIUserList = (data: IUserResponseData): IUserList => {
  // @ts-ignore
  const users: IUserBase[] = data.users.map((user: UserResponse) => ({
    id: user.UI_ID,
    uiFirstName: user.UI_FirstName,
    uiLastName: user.UI_LastName,
    uiEmail: user.UI_Email,
    uiRole: user.UI_Role,
    uiMainRoles: user.UI_Role.filter((role) => role != EUserRole.Alumni)[0],
    uiIsUserAlumni: user.UI_Role.includes(EUserRole.Alumni),
    uiStatus: user.UI_Status,
    uiRegDate: user.UI_RegDate,
    uiPhotoUrl: user.UI_PhotoURL,
    uiMemberPosition: user.UI_MemberPosition,
    uiCountry: user.UI_Country,
    uiFullName: `${user.UI_FirstName} ${user.UI_LastName}`,
    uiInitials: user.UI_FirstName[0] + user.UI_LastName[0],
  }));

  return {
    users: users,
    totalUserCount: data.total_users_count,
  };
};

export function transformUserInfoToEditUserRequest(
  userInfo: IUserInfo
): FormData {
  const formData = new FormData();

  formData.append('UI_FirstName', userInfo.uiFirstName);
  formData.append('UI_LastName', userInfo.uiLastName);
  // if (userInfo.uiRole) {
  //   formData.append('UI_Role', userInfo.uiRole);
  // }
  // if (userInfo.uiStatus) {
  //   formData.append('UI_Status', userInfo.uiStatus);
  // }
  // if (userInfo.uiRegDate) {
  //   formData.append('UI_RegDate', userInfo.uiRegDate);
  // }
  // @ts-ignore
  if (userInfo.uiPhotoUrl) {
    // @ts-ignore
    formData.append('UI_Photo', userInfo.uiPhotoUrl);
  }
  if (userInfo.uiCity) {
    formData.append('UI_City', userInfo.uiCity);
  }
  if (userInfo.uiProvince) {
    formData.append('UI_Province', userInfo.uiProvince);
  }
  if (userInfo.uiCountry) {
    formData.append('UI_Country', userInfo.uiCountry);
  }
  if (userInfo.uiPostalCode) {
    formData.append('UI_PostalCode', userInfo.uiPostalCode);
  }
  if (userInfo.uiPhoneNumber) {
    formData.append('UI_PhoneNumber', userInfo.uiPhoneNumber);
  }
  if (userInfo.uiOrganization) {
    formData.append('UI_Organization', userInfo.uiOrganization);
  }
  if (userInfo.uiAbout) {
    // @ts-ignore
    formData.append('UI_About', userInfo.uiAbout);
  }

  return formData;
}

export const ROLE_OPTIONS = [
  { label: 'Super Admin', value: EUserRole.SuperAdmin },
  { label: 'Admin', value: EUserRole.Admin },
  { label: 'Member', value: EUserRole.Member },
  { label: 'User', value: EUserRole.User },
  { label: 'Public', value: EUserRole.Public },
];

export const MEMBERPOSITION_OPTIONS = [
  { label: 'Director', value: EMemberPosition.Director },
  { label: 'Post Doc Fellow', value: EMemberPosition.PostDoc },
  { label: 'PhD', value: EMemberPosition.Phd },
  { label: 'Master', value: EMemberPosition.Master },
  { label: 'Undergraduate', value: EMemberPosition.Undergrad },
];

export const STATUS_OPTIONS = [
  { label: 'Active', value: EUserStatus.Active },
  { label: 'Unauthenticated', value: EUserStatus.Unauthenticated },
  { label: 'Disabled', value: EUserStatus.Disabled },
];

export const MemberPositionTitles: { [key in EMemberPosition]: string } = {
  [EMemberPosition.Director]: 'Director',
  [EMemberPosition.PostDoc]: 'Post Doc Fellow',
  [EMemberPosition.Phd]: 'PhD',
  [EMemberPosition.Master]: 'Master',
  [EMemberPosition.Undergrad]: 'Undergraduate',
};

export const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

export const getCookies = () => {
  const cookies = nookies.get();
  return cookies;
};

export const handleRoutingOnError = (
  router: any,
  hasError: boolean,
  error: any,
  clearCache?: () => void,
  from?: string,
  clearState?: () => void
) => {
  if (hasError && error) {
    if (error.status === 404) {
      router.replace('/404');
    } else if (error.status === 500) {
      router.replace('/500');
    } else if (error.status === 307) {
    } else {
      router.replace('/access-denied');
    }

    if (clearState) {
      clearState();
    }
  }
};

export function sanitizeAndCompare(str1: string, str2: string) {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

export const hasNavItems = (
  navMenuItems: MenuItem[],
  pathname: string
): string | null => {
  if (!navMenuItems || !pathname) return null;

  const decodedPath = decodeURIComponent(`/${pathname.split('/')[1]}`);

  const findNavItem = (items: MenuItem[]): MenuItem | undefined => {
    return items.find((item: MenuItem) => {
      const isMatch =
        // @ts-ignore
        item.key === decodedPath || item.key.startsWith(decodedPath);

      if (isMatch) {
        return true;
      }

      // @ts-ignore
      if (item.children && item.children.length > 0) {
        // @ts-ignore
        const childMatch = findNavItem(item.children);
        if (childMatch) {
          return true;
        }
      }

      return false;
    });
  };

  // Find the matching item or child
  const currentNavItem = findNavItem(navMenuItems);

  // @ts-ignore
  return currentNavItem ? currentNavItem.key : null;
};

// export const hasNavItems = (navMenuItems: MenuItem[], pathname: string) => {
//   if (!navMenuItems || !pathname) return null;

//   const currentNavItem = navMenuItems.find(
//     (item: MenuItem) =>
//       (item && item.key === decodeURIComponent(`/${pathname.split('/')[1]}`)) ||
//       (item &&
//         // @ts-ignore
//         item.key.startsWith(decodeURIComponent(`/${pathname.split('/')[1]}`)))
//   );

//   return currentNavItem ? currentNavItem.key : null;
// };

export const copyToClipboard = (text: string, notify: Notify) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      clipCopiedSucessfully(notify);
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err);
    });
};

// export const reloadPage = () => {
//   window.location.reload();
// };

export function removeNullValues(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  );
}

export const reloadPage = () => {
  window.location.reload();
};

export const transformPageToIPage = (page: Page): IPage => {
  return {
    pageId: page.PG_ID,
    pageName: page.PG_Name,
    pageDisplayURL: page.PG_DisplayURL,
    pagePermission: page.PG_Permission.map((permission: number) =>
      permission.toString()
    ),
    pageType: page.PG_Type.toString(),
  };
};

export const clearAllCaches = (dispatch: Dispatch) => {
  dispatch(userApi.util.invalidateTags(['Users', 'User']));
  dispatch(
    pageApi.util.invalidateTags([
      'Pages',
      'Menus',
      'Page',
      'PageContent',
      'Users',
    ])
  );
  dispatch(
    pageContentApi.util.invalidateTags([
      'Pages',
      'Menus',
      'Page',
      'PageContent',
      'SinglePageContent',
    ])
  );
  // Add other APIs and tags as needed
};
