import { createApi } from '@reduxjs/toolkit/query/react';
import { PageMenuApiResponse } from '../types/backendResponseInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';

const url = '/pages';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getMenuItems: builder.query<PageMenuApiResponse, void>({
      query: () => url,
      // providesTags: (result) =>
      //   result?.data?.Pages
      //     ? [
      //         ...result.data.Pages.map((page) => ({
      //           type: 'Pages' as const,
      //           id: page.PG_ID,
      //         })),
      //         { type: 'Pages', id: 'LIST' },
      //       ]
      //     : [{ type: 'Pages', id: 'LIST' }],
    }),
  }),
});

export const { useGetMenuItemsQuery } = menuApi;
