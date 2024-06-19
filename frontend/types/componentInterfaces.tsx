import store from '@/store';
import { NotificationPlacement } from 'antd/lib/notification/interface';
import { EPageType, EUserRole } from './enums';
import { ElementType, ReactNode } from 'react';
import { Control, ControllerProps, FieldValues } from 'react-hook-form';
import { string } from 'zod';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface IPageMain {
  pageName: string;
  pageType: EPageType;
  pagePermission: EUserRole[];
  pageContent?: IPageContentItem[];
  isHidden: boolean;
}

export interface IPageListItem {
  pages: IPageMain[];
}

export interface IPage {
  pageId?: string;
  pageName: string;
  pagePermission: EUserRole[];
  pageType: EPageType;
  pageContent?: IPageContentItem[];
  isHidden?: boolean;
}

export interface IPageContentItem {
  display: string;
  name: string;
}

export interface IPageMenuItem extends IPage {
  href: string;
  isHidden: boolean;
}

export interface INotificationContextProps {
  notify: (
    message: string,
    description?: string,
    type?: NotificationType,
    placement?: NotificationPlacement
  ) => void;
  notifyWithAction: (
    message: string,
    description: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

export interface IReactNode {
  children: ReactNode;
}

export interface IFormField {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  multiple?: boolean;
  options?: { value: EUserRole | EPageType | string; label: string }[];
}

export interface ILoadingButton {
  buttonText: string;
  loading: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface ICreatAccount {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAppRequestResult {
  status: 'error' | 'success' | 'warning';
  title: string;
  subTitle?: string;
  extra?: React.ReactNode;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IButton {
  isRightPosition?: boolean;
  Icon?: ElementType;
  href?: string;
  buttonText: string;
  onClick?: () => void | Promise<void>;
  classNames?: string;
}

// export interface IPage {
//   pageName: string;
//   pageType: EPageType;
//   pagePermission: EUserRole[];
//   pageContent: string; // or any other type appropriate for your content
// }
// UI_FirstName: str
// UI_LastName: str
// UI_Email: EmailStr
// UI_Password: str
