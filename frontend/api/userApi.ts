import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  IUserResponseWrapper,
  ICompleteUserResponseWrapper,
  IGenericResponse,
} from '../types/backendResponseInterfaces';
import {
  IEditUserRequest,
  IEditUserRoleStatusRequest,
  IUserGetRequest,
} from '../types/requestInterfaces';
import { GetUsersRequest } from '../hooks/api-hooks/use-user-info';

const url = '/users';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: publicRouteBaseQuery,
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUserResponseWrapper, GetUsersRequest>({
      query: ({ page, limit }) =>
        `${url}/users-list?page=${page}&limit=${limit}`,
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
    getUser: builder.query<ICompleteUserResponseWrapper, IUserGetRequest>({
      query: ({ UI_UniqueURL, PG_PageNumber, PG_PageOffset }) => {
        let queryString = `${url}/${UI_UniqueURL}?pg_page_number=${PG_PageNumber}`;
        if (PG_PageOffset !== undefined) {
          queryString += `&pg_offset=${PG_PageOffset}`;
        }
        return queryString;
      },

      providesTags: (result) =>
        result
          ? [
              { type: 'User', id: result.data.user_response.UI_ID },
              { type: 'User', id: 'USER_PROFILE' },
            ]
          : [{ type: 'User', id: 'USER_PROFILE' }],
    }),
    editUser: builder.mutation<
      IGenericResponse,
      Partial<IEditUserRequest> & Pick<IEditUserRequest, 'UI_ID'>
    >({
      query: ({ UI_ID, ...patch }) => ({
        url: `${url}/${UI_ID}`,
        method: 'PUT',
        body: (patch as any).formData,
      }),
      // invalidatesTags: (result, error, { UI_ID }) => [
      //   { type: 'User', id: UI_ID },
      // ],
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
