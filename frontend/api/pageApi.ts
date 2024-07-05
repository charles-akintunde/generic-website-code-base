import { createApi } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  IGenericResponse,
  IPageResponse,
  ISinglePageResponse,
  Page,
} from '@/types/backendResponseInterfaces';
import { pageTagTypes } from './apiTags';
import {
  IPageRequest,
  IPageRequestWithIdentifier,
} from '@/types/requestInterfaces';

const url = '/pages';

export const pageApi = createApi({
  reducerPath: 'pageApi',
  tagTypes: pageTagTypes,
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getPages: builder.query<IPageResponse, void>({
      query: () => url,
      providesTags: (result) =>
        result?.data?.Pages
          ? [
              ...result.data.Pages.map((page) => ({
                type: 'Pages' as const,
                id: page.PG_ID,
              })),
              { type: 'Pages', id: 'LIST' },
            ]
          : [{ type: 'Pages', id: 'LIST' }],
    }),
    getPage: builder.query<ISinglePageResponse, string>({
      query: (PG_Name) => `${url}/${PG_Name}`,
      providesTags: (result) =>
        result?.data
          ? [
              { type: 'Page', id: result.data.PG_ID },
              { type: 'Page', id: 'LIST' },
              { type: 'PageContent', id: result.data.PG_ID },
              { type: 'PageContent', id: 'LIST' },
            ]
          : [
              { type: 'Page', id: 'LIST' },
              { type: 'PageContent', id: 'LIST' },
            ],
    }),
    createPage: builder.mutation<IPageResponse, IPageRequest>({
      query: (newPage) => ({
        url: `${url}`,
        method: 'POST',
        body: newPage,
      }),
      invalidatesTags: [{ type: 'Pages', id: 'LIST' }],
    }),
    editPage: builder.mutation<
      IPageResponse,
      Partial<IPageRequestWithIdentifier> &
        Pick<IPageRequestWithIdentifier, 'PG_ID'>
    >({
      query: ({ PG_ID, ...patch }) => ({
        url: `${url}/${PG_ID}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { PG_ID }) => [
        { type: 'Pages', id: PG_ID },
      ],
    }),
    deletePage: builder.mutation<IGenericResponse, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Pages', id }],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useCreatePageMutation,
  useEditPageMutation,
  useDeletePageMutation,
  useGetPageQuery,
} = pageApi;
