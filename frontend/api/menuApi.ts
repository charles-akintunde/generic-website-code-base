import { createApi } from '@reduxjs/toolkit/query/react';
import { IMenuItem } from '@/types/commonTypes';
import publicRouteBaseQuery from './publicRouteBaseQuery';

const url = '/pages';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getMenuItems: builder.query<IMenuItem[], void>({
      query: () => url,
    }),
  }),
});

export const { useGetMenuItemsQuery } = menuApi;
