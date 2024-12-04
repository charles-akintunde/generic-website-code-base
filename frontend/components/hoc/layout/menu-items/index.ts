import { IPageMenuItem } from '../../../../types/componentInterfaces';
/**
 * Guide to writing the route JSON:
 *
 * 1. **PageName**: The display name of the page.
 *    - Example: 'Home', 'Teams', 'Events', etc.
 *
 * 2. **Href**: The URL path of the page.
 *    - Example: '/' for home, '/teams' for teams page, '/events' for events page, etc.
 *
 * 3. **IsHidden**: Boolean that determines if the page is hidden from navigation.
 *    - `true` means the page will not be visible in the navigation but still accessible if the URL is known.
 *    - `false` means the page is visible in the navigation.
 *
 * 4. **PagePermission**: Array that defines the roles that have access to the page. The permissions are linked to the user roles.
 *    - Example: `['0', '1', '2', '3', '4']` means users with roles SuperAdmin, Admin, Member, User, and Public have access.
 *    - Roles are based on the `EUserRole` enum:
 *      - `0`: SuperAdmin
 *      - `1`: Admin
 *      - `2`: Member
 *      - `3`: User
 *      - `4`: Public
 *      - `5`: Alumni
 *    - The order of numbers in the array does not matter.
 *
 * 5. **PageType**: Defines the type of page. This helps in distinguishing the layout or functionality of the page.
 *    - `EPageType` enum provides different types:
 *      - `0`: SinglePage - A page that serves as a single entity like a static page or form.
 *      - `1`: PageList - A list or collection of pages, e.g., news or blogs.
 *      - `2`: ResList - Resource list, like research or documents.
 *      - `3`: System - System-related pages like home, admin, and other core pages.
 *
 * 6. **Type**: Determines the type of the menu item in the navigation.
 *    - `item`: Standard item that links directly to a page.
 *    - `parent`: A parent item that can have child menu items under it.
 *    - `child`: A child item that is displayed under a parent item.
 *
 * 7. **Description**: A brief description of the page or menu item (optional).
 *    - Example: A short text describing the purpose of the page, can be left empty if not required.
 *
 * Example Route:
 *
 * {
 *   pageName: 'Home',
 *   href: '/',
 *   isHidden: false,
 *   pagePermission: ['0', '1', '2', '3', '4'], // Accessible by SuperAdmin, Admin, Member, User, and Public
 *   pageType: '3', // System page
 *   description: '',
 *   type: 'item'
 * }
 *
 * - The structure for `parent` type items can contain `children` which is an array of child items.
 * - For hidden pages like 'Reset Password' or 'Admin Panel', `isHidden: true` is used so they don't show in the navigation.
 */
export const systemMenuItems: IPageMenuItem[] = [
  {
    pageName: 'Home',
    href: '/',
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    description: '',
    type: 'item',
  },
  {
    pageName: 'Teams',
    href: '/teams',
    isHidden: false,
    pagePermission: ['0'],
    pageType: '3',
    description: '',
    type: 'item',
  },
  {
    pageName: 'Events',
    href: '/events',
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    description: '',
    type: 'item',
  },
  {
    pageName: 'News',
    href: '/news',
    isHidden: false,
    pagePermission: ['0'],
    pageType: '1',
    description: '',
    type: 'item',
  },
  {
    pageName: 'Research',
    href: '/research',
    isHidden: false,
    pagePermission: ['3', '1', '4', '2', '0', '5'],
    pageType: '2',
    description: '',
    type: 'item',
  },
  {
    pageName: 'Company',
    type: 'parent',
    isHidden: false,
    children: [
      {
        pageName: 'Contact Us',
        href: '/contact-us',
        isHidden: false,
        pagePermission: ['0', '1', '2', '3', '4'],
        pageType: '0',
        description: '',
        type: 'child',
      },
      {
        pageName: 'Privacy Policy',
        href: '/privacy-policy',
        isHidden: false,
        pagePermission: ['0', '1', '2', '3', '4'],
        pageType: '0',
        description: '',
        type: 'child',
      },
    ],
  },
];

export const routes = [
  ...systemMenuItems,
  {
    pageName: 'Reset Password',
    href: '/reset-password',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },
  {
    pageName: 'Confirm User',
    href: '/confirm-user/',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },
  {
    pageName: 'Admin Panel',
    href: '/admin-panel',
    isHidden: true,
    pagePermission: ['0', '1'],
    pageType: '3',
    type: 'item',
  },

  {
    pageName: 'Sign Up',
    href: '/sign-up',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },

  {
    pageName: 'Sign In',
    href: '/sign-in',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },

  {
    pageName: 'User Profile',
    href: '/profile',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },
  {
    pageName: 'Access Denied',
    href: '/access-denied',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },
  {
    pageName: 'Internal Server Error',
    href: '/internal-server-error',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    type: 'item',
  },
];
