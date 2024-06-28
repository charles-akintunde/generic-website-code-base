import { TElement } from '@udecode/plate-common';

export interface Page {
  PG_ID: string;
  PG_Name: string;
  PG_Permission: number[];
  PG_Type: number;
  PG_PageContents?: IPageContentResponse[];
  PG_PageContent?: IPageContentResponse;
}

export interface IPageContentResponse {
  PC_ID: string;
  UI_ID: string;
  PG_ID: string;
  PC_Title: string;
  PC_Content: { [key: string]: TElement[] };
  PC_DisplayURL: string;
  PC_ThumbImgURL?: string | null;
  PC_IsHidden: boolean;
  PC_CreatedAt?: string | null;
  PC_LastUpdatedAt?: string | null;
}

export interface PagesData {
  Pages: Page[];
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
  [x: string]: any;
  data: PagesData;
}

export interface IPageContentGetResponse extends IGenericResponse {
  data: Page;
}

export interface ISinglePageResponse extends IGenericResponse {
  data: Page;
}
