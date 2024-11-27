import store from '../store';
import { NotificationPlacement } from 'antd/lib/notification/interface';
import { EPageType, EUserRole } from './enums';
import React, { ElementType, ReactNode } from 'react';
import { Control, ControllerProps, FieldValues } from 'react-hook-form';
// import { string, z, z, z } from 'zod';
import { TElement } from '@udecode/plate-common';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface IPageMain {
  pageId: string;
  pageName: string;
  pageType: string;
  pageDisplayURL?: string;
  pagePermission: string[];
  pageContents?: IPageContentItem[] | IPageContentMain[];
  pageContent?: IPageContentMain;
  isHidden: boolean;
  href: string;
}

export interface IOptionType {
  label: string;
  value: string | number;
}

export interface IUserBase {
  id: string;
  uiUniqueURL: string;
  uiFirstName: string;
  uiLastName: string;
  uiEmail: string;
  uiRole: string[];
  uiMainRoles: string;
  uiStatus: string;
  uiRegDate: string;
  uiPhoto: string | File | null;
  uiMemberPosition?: string | null;
  uiCountry?: string | null | undefined;
  uiInitials?: string | null | undefined;
  uiPrefix?: string | null | undefined;
  uiSuffix?: string | null | undefined;
  uiFullName?: string | null | undefined;
  uiIsUserAlumni: boolean;
}

export interface IUserInfo extends IUserBase {
  uiCity: string | null;
  uiProvince: string | null;
  uiCountry: string | null;
  uiPostalCode: string | null;
  uiPhoneNumber: string | null;
  uiOrganization: string | null;
  uiAbout: TElement[] | null;
  uiUserPageContents?: IPageContentMain[];
}

export interface IUIActiveUser {
  uiId: string | null;
  uiFullName: string;
  uiInitials: string;
  uiIsAdmin: boolean;
  uiIsSuperAdmin: boolean;
  uiIsLoading: boolean;
  uiCanEdit: boolean;
  uiRole: string[];
  uiPhotoURL: string | null | File;
}

export interface IUserList {
  users: IUserBase[];
  totalUserCount: number;
}

export interface IPageList {
  pages: IPageMain[];
  pgTotalPageCount: number;
}

export interface IPageListItem {
  pages: IPageMain[];
}

export interface IPage {
  pageId?: string;
  pageName: string;
  pageDisplayURL?: string;
  pagePermission: string[];
  pageType: string;
  pageContents?: IPageContentItem[];
  isHidden?: boolean;
}

export interface IPageContentBase {
  pageContentName: string;
  pageContentDisplayImage?: string | File;
  pageContentResource?: string | File;
  isPageContentHidden: boolean;
  editorContent: TElement[];
}

export interface IPageContentMain extends IPageContentItem {
  pageContentId: string;
  pageContentLastUpdatedAt?: string;
  pageContentExcerpt?: string;
  pageContentReadingTime?: string;
  creatorFullName?: string;
  pageContenAssociatedUsers: IOptionType[] | [];
}

// export interface IPageContenAssociatedUsers {
//   userId: string;
//   userFullName: string;
// }

export interface IPageContentItem extends IPageContentBase {
  pageId: string;
  pageType?: string;
  pageName: string;
  pageDisplayURL: string;
  pageContentCreatedAt?: Date | string;
  pageContentDisplayURL: string;
  pageContentUsersId?: string[];
  userId: string;
  href: string;
}

export interface ITablePagination {
  current: number;
  pageSize: number;
}

export interface IPageMenuItem {
  href?: string;
  description?: string;
  children?: IPageMenuItem[];
  type: 'parent' | 'child' | 'item';
  pageId?: string;
  pageName: string;
  pageDisplayURL?: string;
  pagePermission?: string[];
  pageType?: string;
  pageContents?: IPageContentItem[];
  isHidden?: boolean;
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
  onChange?: (value: any) => void;
  onBlur?: (events: React.FocusEvent<any>) => void;
}

export interface ILoadingButton {
  buttonText: string;
  className?: string;
  loading: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void | Promise<void>;
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
  onClick?: (() => void | Promise<void>) | undefined;
  classNames?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
}

export type Notify = (
  message: string,
  description?: string,
  type?: NotificationType,
  placement?: NotificationPlacement
) => void;
//

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

export interface IPageContentImage {
  pageContentImage: File;
}

export interface IFetchedPage {
  fetchedPage: IPageMain | null;
  isPageFetchLoading: boolean;
  hasPageFetchError: boolean;
  pageFetchError: FetchBaseQueryError | SerializedError | undefined;
}

export interface IFetchedSinglePage {
  fetchedPage: IPage | null;
  isPageFetchLoading: boolean;
  hasPageFetchError: boolean;
  pageFetchError: FetchBaseQueryError | SerializedError | undefined | null;
}
