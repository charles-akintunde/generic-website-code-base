import {
  IPageContentGetResponse,
  IPageContentResponse,
  Page,
} from '@/types/backendResponseInterfaces';
import {
  IPageContentItem,
  IPageMain,
  Notify,
} from '@/types/componentInterfaces';
import { EPageType, EUserRole } from '@/types/enums';
import { TElement } from '@udecode/plate-common';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';
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
    pageContents: {
      pageContentId: pageContent.PC_ID,
      pageName: page.PG_Name,
      pageId: pageContent.PG_ID,
      userId: pageContent.UI_ID,
      href: `${toKebabCase(page.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
      pageContentName: pageContent.PC_Title,
      pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
      isPageContentHidden: pageContent.PC_IsHidden,
      pageContents: pageContent.PC_Content?.PC_Content,
      pageContentCreatedAt: pageContent.PC_CreatedAt as string,
      // creatorFullName: `${pageContent.UI_FirstName} ${pageContent.UI_LastName}`,
    },
  };

  return normalizedPage;
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
  pageName: string,
  currentUserId: string,
  href: string
): IPageContentItem => {
  return {
    pageContentName: data.pageContentName,
    pageContentDisplayImage: data.pageContentDisplayImage,
    isPageContentHidden: data.isPageContentHidden,
    pageContents: plateEditor,
    pageId: pageId,
    pageName: pageName,
    href: href,
    userId: currentUserId,
  };
};
