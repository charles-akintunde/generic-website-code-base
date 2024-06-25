import { createApi } from '@reduxjs/toolkit/query/react';
import { IGenericResponse } from '@/types/backendResponseInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import { pageTagTypes } from './apiTags';

const url = '/page-contents';

export const pageContentApi = createApi({
  reducerPath: 'pageContentApi',
  tagTypes: pageTagTypes,
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    createPageContent: builder.mutation<IGenericResponse, IPageContentRequest>({
      query: (newPageContent) => ({
        url: url,
        method: 'POST',
        body: newPageContent,
      }),
      invalidatesTags: [{ type: 'Page', id: 'LIST' }],
    }),
  }),
});

export const { useCreatePageContentMutation } = pageContentApi;
