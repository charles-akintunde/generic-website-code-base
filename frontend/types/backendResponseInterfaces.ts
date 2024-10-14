import { TElement } from '@udecode/plate-common';
import { EUserRole, EUserStatus } from './enums';

export interface Page {
  PG_ID: string;
  PG_Name: string;
  PG_Permission: number[];
  PG_Type: number;
  PG_DisplayURL: string;
  PC_DisplayURL: string;
  PC_Excerpt?: string;
  PC_ReadingTime?: string;
  PG_PageContents?: IPageContentResponse[];
  PG_PageContent?: IPageContentResponse;
}

export interface IPageContentResponse {
  PC_ID: string;
  UI_ID: string;
  UI_FirstName: string;
  UI_LastName: string;
  PG_ID: string;
  PC_Title: string;
  PG_DisplayURL: string;
  PC_Content: { [key: string]: TElement[] };
  PC_DisplayURL: string;
  PC_ResourceURL?: string;
  PC_ThumbImgURL?: string | null;
  PC_IsHidden: boolean;
  PC_CreatedAt?: string | null;
  PC_LastUpdatedAt?: string | null;
}

export interface UserResponse {
  UI_ID: string;
  UI_FirstName: string;
  UI_LastName: string;
  UI_Email: string;
  UI_Role: EUserRole[];
  UI_Status: EUserStatus;
  UI_City: string | null;
  UI_RegDate: string;
  UI_PhotoURL: string | null;
  UI_MemberPosition: string;
  UI_Country?: string | null | undefined;
}

export interface ICompleteUserResponse extends UserResponse {
  UI_Province: string | null;
  UI_Country: string;
  UI_PostalCode: string | null;
  UI_PhoneNumber: string | null;
  UI_Organization: string | null;
  UI_About: { UI_About: TElement[] | null };
}

export interface IUserResponseData {
  users: UserResponse[];
  last_first_name: string | null;
  last_last_name: string | null;
  last_uuid: string | null;
  total_users_count: number;
}

export interface IUserResponseWrapper {
  data: IUserResponseData;
}

export interface ICompleteUserResponseWrapper {
  data: ICompleteUserResponse;
}

export interface PagesData {
  Pages: Page[];
  totalPageCount?: number | undefined;
  PG_PageCount?: number | undefined;
  PG_Pages: Page[];
}

export interface PageData {
  Page: Page;
}

export interface PageContentData extends Page {
  PageContent: IPageContentResponse;
}

export interface ICreateAccountResponse {}

export interface IGenericResponse {
  success: boolean;
  message: string;
  detail?: string; // Optional detail property
  data?: any;
}

export interface PageMenuApiResponse extends IGenericResponse {
  [x: string]: any;
  data: PagesData;
}

export interface IPageResponse extends IGenericResponse {
  data: PagesData;
}

export interface IPageContentGetResponse extends IGenericResponse {
  data: Page;
}

export interface ISinglePageResponse extends IGenericResponse {
  data: Page;
}

// export interface ISinglePageDataOnlyResponse extends IGenericResponse {
//   data: Page;
// }

export interface IGetPagesWithOffsetRequest {
  PG_Number: number;
  PG_Limit: number;
}

export interface IPageContentImageData {
  PC_PageContentURL: string;
}

export interface IPageContentImageResponse extends IGenericResponse {
  data: IPageContentImageData;
}
