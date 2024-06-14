import store from '@/store';
import { NotificationPlacement } from 'antd/lib/notification/interface';
import { EPageType, EUserRole } from './enums';
import { ReactNode } from 'react';
import { Control, ControllerProps, FieldValues } from 'react-hook-form';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface IPage {
  pageId?: string;
  pageName: string;
  pagePermission?: EUserRole[];
  pageType?: EPageType;
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

// UI_FirstName: str
// UI_LastName: str
// UI_Email: EmailStr
// UI_Password: str
