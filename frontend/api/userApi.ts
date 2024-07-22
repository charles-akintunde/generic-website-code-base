import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  ICompleteUserResponseWrapper,
  IGenericResponse,
  IUserResponseWrapper,
} from '@/types/backendResponseInterfaces';
import { GetUsersRequest } from '@/hooks/api-hooks/use-user-info';

const url = '/users';

export const userApi = createApi({
  reducerPath: 'api',
  baseQuery: publicRouteBaseQuery,
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUserResponseWrapper, GetUsersRequest>({
      query: ({ page, limit }) => `${url}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ UI_ID }) => ({
                type: 'Users' as const,
                id: UI_ID,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUser: builder.query<ICompleteUserResponseWrapper, string>({
      query: (UI_ID) => `${url}/${UI_ID}`,
      providesTags: (result) =>
        result
          ? [
              { type: 'User', id: result.data.UI_ID },
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<IGenericResponse, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation, useGetUserQuery } =
  userApi;
