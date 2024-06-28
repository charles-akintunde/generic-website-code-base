import { EPageType, EUserRole } from '@/types/enums';
import { jwtDecode } from 'jwt-decode';
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
  let accessToken = localStorage.getItem('access_token');
  let refreshToken = localStorage.getItem('access_token');

  return { accessToken: accessToken, refreshToken: refreshToken };
};
