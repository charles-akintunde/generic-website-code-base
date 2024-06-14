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
