import { createApi } from '@reduxjs/toolkit/query/react';
import { IGenericResponse } from '@/types/backendResponseInterfaces';
import {
  ICreatAccountRequest,
  IPasswordResetConfirmationRequest,
  IPasswordResetRequest,
  IToken,
  IUserLoginRequest,
} from '@/types/requestInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import Cookies from 'js-cookie';

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
  }),
});

export const {
  useCreateAccountMutation,
  useVerifyAccountMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
  useResetPasswordWithEmailMutation,
  useResetPasswordWithTokenMutation,
} = authApi;
