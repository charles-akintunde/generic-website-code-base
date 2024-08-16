import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  ICompleteUserResponseWrapper,
  IGenericResponse,
  IUserResponseWrapper,
} from '@/types/backendResponseInterfaces';
import { GetUsersRequest } from '@/hooks/api-hooks/use-user-info';
import {
  IEditUserRequest,
  IEditUserRoleStatusRequest,
} from '@/types/requestInterfaces';

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
    getUsersAssignedPositions: builder.query<IUserResponseWrapper, void>({
      query: () => `${url}/members`,
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
    editUser: builder.mutation<
      IGenericResponse,
      Partial<IEditUserRequest> & Pick<IEditUserRequest, 'UI_ID'>
    >({
      query: ({ UI_ID, ...patch }) => ({
        url: `${url}/${UI_ID}`,
        method: 'PUT',
        body: patch.formData,
      }),
      invalidatesTags: (result, error, { UI_ID }) => [
        { type: 'User', id: UI_ID },
      ],
    }),
    editRoleAndStatus: builder.mutation<
      IGenericResponse,
      Partial<IEditUserRoleStatusRequest>
    >({
      query: (statusRoleUpdate) => ({
        url: `${url}/role-status`,
        method: 'PUT',
        body: statusRoleUpdate,
      }),
      invalidatesTags: (result, error, { UI_ID }) => [
        { type: 'Users', id: UI_ID },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<IGenericResponse, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserQuery,
  useEditRoleAndStatusMutation,
  useEditUserMutation,
  useGetUsersAssignedPositionsQuery,
} = userApi;
