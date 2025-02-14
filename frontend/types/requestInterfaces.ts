import { TElement } from '@udecode/plate-common';
import { StyledString } from 'next/dist/build/swc';

export interface ICreatAccountRequest {
  UI_FirstName: string;
  UI_LastName: string;
  UI_Email: string;
  UI_Password: string;
}

export interface IToken {
  token: string;
}

export interface IUserLoginRequest {
  UI_Email: string;
  UI_Password: string;
}

export interface IPageRequest {
  PG_Name: string;
  PG_Permission: number[];
  PG_Type?: number;
  PG_DisplayURL: string;
}

export interface IPageGetRequest {
  PG_DisplayURL: string;
  PG_PageNumber: number;
  PG_PageOffset?: number;
}

export interface IUserGetRequest {
  UI_UniqueURL: string;
  PG_PageNumber: number;
  PG_PageOffset?: number;
}

export interface IPageContentGetRequest {
  PG_DisplayURL: string;
  PC_DisplayURL: string;
}

export interface IPageRequestWithIdentifier extends IPageRequest {
  PG_ID: string;
}

export interface IPageContentCreateRequest {
  UI_ID: string;
  PG_ID: string;
  PC_Title: string;
  PC_Content: { [key: string]: TElement[] };
  PC_DisplayURL: string;
  PC_ThumbImg: File | string;
  PC_IsHidden: boolean;
  PC_CreatedAt: string;
  PC_UsersId: string[];
}

export interface IEditPageContentRequest {
  PC_ID: string;
  PC_Title?: string;
  PC_Content?: string;
  PC_ThumbImg?: string;
  PC_Resource?: string;
  PC_IsHidden?: boolean;
  PC_DisplayURL?: boolean;
  PC_CreatedAt?: string;
}

export interface IEditUserRequest {
  UI_ID: string;
  UI_FirstName: string;
  UI_LastName: string;
  UI_PhotoUrl: string;
  UI_City: string | null;
  UI_Province: string | null;
  UI_Country: string;
  UI_PostalCode: string | null;
  UI_PhoneNumber: string | null;
  UI_Organization: string | null;
  UI_About: string | null;
}

export interface IEditUserRoleStatusRequest {
  UI_ID: string;
  UI_Role: Number[] | null;
  UI_Status: Number | null;
  UI_MemberPosition: Number | null;
}

export interface IPasswordResetRequest {
  UI_Email: string;
}

export interface IPasswordResetConfirmationRequest {
  UI_NewPassword: string;
  UI_Token: string;
}

export interface IPageContentImageRequest {
  PC_PageContentImg: File;
}

export interface ISinglePageRequest {
  PG_DisplayURL: string;
}
