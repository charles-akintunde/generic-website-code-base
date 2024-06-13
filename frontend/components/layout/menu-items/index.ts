import { IPageMenuItem } from '@/types/componentInterfaces';

export const systemMenuItems: IPageMenuItem[] = [
  { pageName: 'Home', href: '/', isHidden: false },
  { pageName: 'Teams', href: '/teams', isHidden: false },
  { pageName: 'Admin Panel', href: '/admin-panel', isHidden: true },
  { pageName: 'Sign In', href: '/sign-in', isHidden: false },
];
