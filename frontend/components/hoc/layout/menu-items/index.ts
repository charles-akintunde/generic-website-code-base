import { IPageMenuItem } from '@/types/componentInterfaces';

export const systemMenuItems: IPageMenuItem[] = [
  {
    pageName: 'Home',
    href: '/',
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    description: '',
  },
  {
    pageName: 'Teams',
    href: '/teams',
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
    description: '',
  },
  {
    pageName: 'Single Page1',
    href: '/single-page1',
    isHidden: false,
    pagePermission: ['3', '1', '4', '2', '0'],
    pageType: '0',
    description: '',
  },
  {
    pageName: 'Test page',
    href: '/test-page',
    isHidden: false,
    pagePermission: ['3', '1', '4', '2', '0', '5'],
    pageType: '1',
    description: '',
  },
  {
    pageName: 'Tinubu’s 15-Month1',
    href: '/tinubu’s-15-month1',
    isHidden: false,
    pagePermission: ['3', '1', '4', '2', '0', '5'],
    pageType: '2',
    description: '',
  },
  {
    pageName: 'Admin Panel',
    href: '/admin-panel',
    isHidden: true,
    pagePermission: ['0', '1'],
    pageType: '3',
  },
  {
    pageName: 'Sign In',
    href: '/sign-in',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },

  {
    pageName: 'Sign Up',
    href: '/sign-up',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },

  {
    pageName: 'Terms and Services',
    href: '/terms-and-services',
    isHidden: true,
    pagePermission: ['0', '1', '2'],
    pageType: '3',
    description: '',
  },
  {
    pageName: 'User Profile',
    href: '/user-profile',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },
  {
    pageName: 'Access Denied',
    href: '/access-denied',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
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
  },
  {
    pageName: 'Confirm User',
    href: '/confirm-user/',
    isHidden: true,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },
];
