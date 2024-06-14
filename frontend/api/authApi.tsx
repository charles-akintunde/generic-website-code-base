import { createApi } from '@reduxjs/toolkit/query/react';
import { IGenericResponse } from '@/types/backendResponseInterfaces';
import { ICreatAccountRequest } from '@/types/requestInterfaces';
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
  }),
});

export const { useCreateAccountMutation } = authApi;
