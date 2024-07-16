import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import { IUserResponse } from '@/types/backendResponseInterfaces';
import { GetUsersRequest } from '@/hooks/api-hooks/use-user-info';

const url = '/users';

export const userApi = createApi({
  reducerPath: 'api',
  baseQuery: publicRouteBaseQuery,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUserResponse, GetUsersRequest>({
      query: ({ lastFirstName, lastLastName, lastUUID, limit }) =>
        `${url}?last_first_name=${lastFirstName}&last_last_name=${lastLastName}&last_uuid=${lastUUID}&limit=${limit}`,
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
  }),
});

export const { useGetUsersQuery } = userApi;
