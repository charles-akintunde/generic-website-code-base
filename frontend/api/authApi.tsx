import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ICompleteUserResponseWrapper,
  IGenericResponse,
} from '../types/backendResponseInterfaces';
import {
  ICreatAccountRequest,
  IPasswordResetConfirmationRequest,
  IPasswordResetRequest,
  IToken,
  IUserLoginRequest,
} from '../types/requestInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';

const commonUrl = '/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    createAccount: builder.mutation<IGenericResponse, ICreatAccountRequest>({
      query: (createAccountRequest: ICreatAccountRequest) => ({
        url: `${commonUrl}/register`,
        method: 'POST',
        body: createAccountRequest,
      }),
    }),
    refreshToken: builder.mutation<IGenericResponse, void>({
      query: () => ({
        url: `${commonUrl}/refresh-token`,
        method: 'POST',
        credentials: 'include',
      }),
    }),
    verifyAccount: builder.mutation<IGenericResponse, IToken>({
      query: (token: IToken) => ({
        url: `${commonUrl}/account/confirm/`,
        method: 'POST',
        body: token,
      }),
    }),
    userLogin: builder.mutation<IGenericResponse, IUserLoginRequest>({
      query: (userLoginRegquest: IUserLoginRequest) => ({
        url: `${commonUrl}/login`,
        method: 'POST',
        body: userLoginRegquest,
        credentials: 'include',
      }),
    }),
    userLogout: builder.mutation<IGenericResponse, void>({
      query: () => {
        return {
          url: `${commonUrl}/logout`,
          method: 'POST',
          credentials: 'include',
        };
      },
    }),
    resetPasswordWithEmail: builder.mutation<IGenericResponse, any>({
      query: (passwordReset: IPasswordResetRequest) => ({
        url: `${commonUrl}/password-reset`,
        method: 'POST',
        body: passwordReset,
        credentials: 'include',
      }),
    }),
    resetPasswordWithToken: builder.mutation<IGenericResponse, any>({
      query: (passwordReset: IPasswordResetConfirmationRequest) => ({
        url: `${commonUrl}/password-reset/confirm`,
        method: 'POST',
        body: passwordReset,
        credentials: 'include',
      }),
    }),
    getActiveUser: builder.query<ICompleteUserResponseWrapper, void>({
      query: () => ({
        url: `${commonUrl}/active-user`,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useVerifyAccountMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
  useResetPasswordWithEmailMutation,
  useResetPasswordWithTokenMutation,
  useGetActiveUserQuery,
  useRefreshTokenMutation,
} = authApi;
