import { TElement } from '@udecode/plate-common';

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
}

export interface IPageContentGetRequest {
  PG_Name: string;
  PC_Title: string;
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
}
