import { EPageType, EUserRole } from '@/types/enums';

export const toKebabCase = (str: string): string => {
  str = str.toLowerCase();
  str = str.replace(/ /g, '-');
  return str;
};

export const fromKebabCase = (str: string): string => {
  str = str.replace(/-/g, ' ');
  return str.charAt(0).toUpperCase() + str.slice(1);
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
