export interface Page {
  PG_ID: string;
  PG_Name: string;
  PG_Permission: number[];
  PG_Type: number;
}

export interface PagesData {
  Pages: Page[];
}

export interface PageMenuApiResponse {
  data: PagesData;
}
