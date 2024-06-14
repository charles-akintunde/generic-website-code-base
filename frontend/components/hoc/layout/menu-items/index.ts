import { IPageMenuItem } from '@/types/componentInterfaces';

export const systemMenuItems: IPageMenuItem[] = [
  { pageName: 'Home', href: '/', isHidden: false },
  { pageName: 'Teams', href: '/teams', isHidden: false },
  { pageName: 'Admin Panel', href: '/admin-panel', isHidden: false },
  { pageName: 'Sign In', href: '/sign-in', isHidden: false },
  { pageName: 'Sign Up', href: '/sign-up', isHidden: false },
  { pageName: 'Reset Password', href: '/reset-password', isHidden: false },
  { pageName: 'Confirm User', href: '/confirm-user/', isHidden: true },

  {
    pageName: 'Terms and Services',
    href: '/terms-and-services',
    isHidden: true,
  },
];
