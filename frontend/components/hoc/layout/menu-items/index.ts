import { IPageMenuItem } from '@/types/componentInterfaces';

export const systemMenuItems: IPageMenuItem[] = [
  {
    pageName: 'Home',
    href: '/',
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },
  {
    pageName: 'Teams',
    href: '/teams',
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },
  {
    pageName: 'Admin Panel',
    href: '/admin-panel',
    isHidden: false,
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
  {
    pageName: 'Terms and Services',
    href: '/terms-and-services',
    isHidden: true,
    pagePermission: ['0', '1', '2'],
    pageType: '3',
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
    isHidden: false,
    pagePermission: ['0', '1', '2', '3', '4'],
    pageType: '3',
  },
  {
    pageName: 'Terms and Services',
    href: '/terms-and-services',
    isHidden: false,
    pagePermission: ['0', '1', '2'],
    pageType: '3',
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
    isHidden: false,
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
