import { createApi } from '@reduxjs/toolkit/query/react';
import { PageMenuApiResponse } from '@/types/backendResponseInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';

const url = '/pages';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getMenuItems: builder.query<PageMenuApiResponse, void>({
      query: () => url,
    }),
  }),
});

export const { useGetMenuItemsQuery } = menuApi;
