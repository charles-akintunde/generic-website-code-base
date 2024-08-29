import { createApi } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  IGenericResponse,
  IGetPagesWithOffsetRequest,
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
  tagTypes: ['Pages', 'Menus', 'Page', 'PageContent'],
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getPages: builder.query<IPageResponse, void>({
      query: () => url,
      providesTags: (result) => {
        //  console.log('providesTags result:', result);
        return result?.data?.Pages
          ? [
              ...result.data.Pages.map((page) => ({
                type: 'Pages' as const,
                id: page.PG_ID,
              })),
              { type: 'Pages', id: 'LIST' },
            ]
          : [{ type: 'Pages', id: 'LIST' }];
      },
    }),
    getPagesWithOffset: builder.query<
      IPageResponse,
      IGetPagesWithOffsetRequest
    >({
      query: ({ PG_Number, PG_Limit }) =>
        `${url}/?pg_page_number=${PG_Number}&pg_page_limit=${PG_Limit}`,
      providesTags: (result) => {
        console.log('providesTags result:', result);
        return result?.data?.Pages
          ? [
              ...result.data.Pages.map((page) => ({
                type: 'Pages' as const,
                id: page.PG_ID,
              })),
              { type: 'Pages', id: 'LIST' },
            ]
          : [{ type: 'Pages', id: 'LIST' }];
      },
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
        { type: 'Pages', id: 'LIST' },
      ],
    }),
    deletePage: builder.mutation<IGenericResponse, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Pages', id: id },
        { type: 'Pages', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useCreatePageMutation,
  useEditPageMutation,
  useDeletePageMutation,
  useGetPageQuery,
  useGetPagesWithOffsetQuery,
} = pageApi;
