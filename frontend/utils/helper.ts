import {
  ICompleteUserResponse,
  IPageContentGetResponse,
  IPageContentResponse,
  IUserResponseData,
  Page,
  PagesData,
  UserResponse,
} from '@/types/backendResponseInterfaces';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
  IUserBase,
  IUserList,
  IUserInfo,
  Notify,
  IPageList,
} from '@/types/componentInterfaces';
import {
  EMemberPosition,
  EPageType,
  EUserRole,
  EUserStatus,
} from '@/types/enums';
import { IEditUserRequest } from '@/types/requestInterfaces';
import { TElement } from '@udecode/plate-common';
import { MenuProps } from 'antd';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';
import nookies from 'nookies';
type MenuItem = Required<MenuProps>['items'][number];

export const toKebabCase = (str: string): string => {
  str = str.toLowerCase();
  str = str.replace(/ /g, '-');
  return str;
};

export const fromKebabCase = (str: string): string => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
};

export const userStatusLabels: { [key in EUserStatus]: string } = {
  [EUserStatus.Active]: 'Active',
  [EUserStatus.Unauthenticated]: 'Unauthenticated',
  [EUserStatus.Disabled]: 'Disabled',
};

export const memberPositionLabels: { [key in EMemberPosition]: string } = {
  [EMemberPosition.DIRECTOR]: 'Director',
  [EMemberPosition.POSTDOC]: 'Postdoc',
  [EMemberPosition.PHD]: 'PhD',
  [EMemberPosition.MASTER]: 'Masters',
  [EMemberPosition.UNDERGRAD]: 'Undergrad',
};

export const roleColors: { [key in EUserRole]: string } = {
  [EUserRole.SuperAdmin]: 'superadmin-badge',
  [EUserRole.Admin]: 'admin-badge',
  [EUserRole.Member]: 'user-badge',
  [EUserRole.User]: 'user-badge',
  [EUserRole.Public]: 'public-badge',
};

export const statusColors: { [key in EUserStatus]: string } = {
  [EUserStatus.Active]: 'active-status',
  [EUserStatus.Unauthenticated]: 'unauthenticated-status',
  [EUserStatus.Disabled]: 'disabled-status',
};

export const positionColors: { [key in EMemberPosition]: string } = {
  [EMemberPosition.DIRECTOR]: 'director-position',
  [EMemberPosition.POSTDOC]: 'postdoc-position',
  [EMemberPosition.PHD]: 'postdoc-position',
  [EMemberPosition.MASTER]: 'postdoc-position',
  [EMemberPosition.UNDERGRAD]: 'postdoc-position',
};

export const roleBadgeClasses: { [key in EUserRole]: string } = {
  [EUserRole.SuperAdmin]: 'red',
  [EUserRole.Admin]: 'green',
  [EUserRole.Member]: 'blue',
  [EUserRole.User]: 'blue',
  [EUserRole.Public]: 'gray',
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

export const getPageExcerpt = (contents: TElement[]) => {
  let excerpt = '';
  for (let content of contents) {
    if (content.type === 'p' || content.type.startsWith('h')) {
      for (let child of content.children) {
        excerpt += excerpt + child.text;
      }
      break;
    }
  }
  return excerpt;
};

export function estimateReadingTime(pageContents: TElement[]) {
  let totalWords = 0;
  let imageCount = 0;

  const readingSpeed = 200; // words per minute
  const imageReadingTime = 5; // seconds per image

  // Traverse through the page contents
  pageContents.forEach((content) => {
    if (content.type === 'p') {
      // Count words in <p> elements
      content.children.forEach((child) => {
        if (child.text) {
          totalWords += countWords(child.text);
        }
      });
    } else if (content.type === 'img') {
      // Count images
      imageCount += content.children.length;
    }
  });

  // Calculate reading time
  const readingTimeMinutes = totalWords / readingSpeed;
  const imageTimeMinutes = (imageCount * imageReadingTime) / 60;

  const totalReadingTimeMinutes = readingTimeMinutes + imageTimeMinutes;

  return Math.round(totalReadingTimeMinutes); // Return in minutes, rounded to the nearest whole number
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

export const hasPermission = (
  currentUserRole: string,
  pagePermission: string[]
): boolean => {
  if (pagePermission == undefined || pagePermission == null) {
    return false;
  }
  return pagePermission.includes(currentUserRole);
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
    isHidden: false,
    href: `/${toKebabCase(page.PG_Name)}`,
    pageContent: {
      pageContentId: pageContent.PC_ID,
      pageName: page.PG_Name,
      pageType: String(page.PG_Type),
      pageId: pageContent.PG_ID,
      userId: pageContent.UI_ID,
      href: `${toKebabCase(page.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
      pageContentName: pageContent.PC_Title,
      pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
      pageContentResource: pageContent.PC_DisplayURL as string,
      isPageContentHidden: pageContent.PC_IsHidden,
      editorContent: pageContent.PC_Content?.PC_Content,
      pageContentCreatedAt: pageContent.PC_CreatedAt as string,
      creatorFullName: `${pageContent.UI_FirstName} ${pageContent.UI_LastName}`,
    },
  };

  return normalizedPage;
};

export const transformToUserInfo = (data: ICompleteUserResponse): IUserInfo => {
  return {
    id: data.UI_ID,
    uiFirstName: data.UI_FirstName,
    uiLastName: data.UI_LastName,
    uiEmail: data.UI_Email,
    uiRole: data.UI_Role as EUserRole,
    uiStatus: data.UI_Status as EUserStatus,
    uiRegDate: data.UI_RegDate,
    uiPhoto: data.UI_PhotoURL ? data.UI_PhotoURL : null,
    uiCity: data.UI_City,
    uiProvince: data.UI_Province,
    uiCountry: data.UI_Country,
    uiPostalCode: data.UI_PostalCode,
    uiPhoneNumber: data.UI_PhoneNumber,
    uiOrganization: data.UI_Organization,
    uiAbout: data.UI_About,
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

export const normalizeMultiContentPage = (
  response: Page,
  isSinglePage: boolean
): IPageMain => {
  const pageContents: IPageContentMain[] | undefined =
    response.PG_PageContents?.map((pageContent: any) => {
      return {
        pageContentId: pageContent.PC_ID,
        pageId: pageContent.PG_ID,
        pageName: response.PG_Name,
        userId: pageContent.UI_ID,
        href: isSinglePage
          ? toKebabCase(response.PG_Name)
          : `${toKebabCase(response.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
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
    href: `/${toKebabCase(response.PG_Name)}`,
  };
};

export const mapPageToIPageMain = (pagesData: PagesData): IPageList => {
  const pages = pagesData.PG_Pages.map((page) => ({
    pageId: page.PG_ID,
    pageName: page.PG_Name,
    pagePermission: page.PG_Permission.map((permission) => String(permission)),
    pageType: String(page.PG_Type),
    isHidden: false,
    href: `/${toKebabCase(page.PG_Name)}`,
  }));

  return {
    pages: pages,
    pgTotalPageCount: pagesData.PG_PageCount,
  };
};

export const mapToIIUserList = (data: IUserResponseData): IUserList => {
  console.log(data, 'DATA');
  const users: IUserBase[] = data.users.map((user: UserResponse) => ({
    id: user.UI_ID,
    uiFirstName: user.UI_FirstName,
    uiLastName: user.UI_LastName,
    uiEmail: user.UI_Email,
    uiRole: user.UI_Role,
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
  if (userInfo.uiPhotoUrl) {
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
  { label: 'Director', value: EMemberPosition.DIRECTOR },
  { label: 'Post Doc Fellow', value: EMemberPosition.POSTDOC },
  { label: 'PhD', value: EMemberPosition.PHD },
  { label: 'Master', value: EMemberPosition.MASTER },
  { label: 'Undergraduate', value: EMemberPosition.UNDERGRAD },
];

export const STATUS_OPTIONS = [
  { label: 'Active', value: EUserStatus.Active },
  { label: 'Unauthenticated', value: EUserStatus.Unauthenticated },
  { label: 'Disabled', value: EUserStatus.Disabled },
];

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
  error: any
) => {
  if (hasError && error) {
    if (error.status === 404) {
      router.replace('/404');
    } else if (error.status === 500) {
      router.replace('/500');
    } else {
      router.replace('/access-denied');
    }
  }
};

export const hasNavItems = (navMenuItems: MenuItem[], pathname: string) => {
  if (!navMenuItems || !pathname) return null;

  const currentNavItem = navMenuItems.find(
    (item: MenuItem) =>
      (item && item.key === `/${pathname.split('/')[1]}`) ||
      (item && item.key.startsWith(`/${pathname.split('/')[1]}`))
  );

  return currentNavItem ? currentNavItem.key : null;
};

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

export const reloadPage = () => {
  window.location.reload();
};
