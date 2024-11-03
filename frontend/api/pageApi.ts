import { createApi } from '@reduxjs/toolkit/query/react';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  ISinglePageResponse,
  IGenericResponse,
  IGetPagesWithOffsetRequest,
  IPageResponse,
  IUserResponseWrapper,
} from '../types/backendResponseInterfaces';
import {
  IPageGetRequest,
  IPageRequest,
  IPageRequestWithIdentifier,
  ISinglePageRequest,
} from '../types/requestInterfaces';
import { GetUsersRequest } from '../hooks/api-hooks/use-user-info';

const url = '/pages';

export const pageApi = createApi({
  reducerPath: 'pageApi',
  tagTypes: ['Pages', 'Menus', 'Page', 'PageContent', 'Users'],
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<IUserResponseWrapper, GetUsersRequest>({
      query: ({ page, limit }) =>
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users-list?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result?.data?.users?.map(({ UI_ID }) => ({
                type: 'Users' as const,
                id: UI_ID,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getPages: builder.query<IPageResponse, void>({
      query: () => url,
      providesTags: (result) => {
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
    getPageColumnsByDisplayUrl: builder.query<
      ISinglePageResponse,
      ISinglePageRequest
    >({
      query: ({ PG_DisplayURL }) => `${url}/columns/${PG_DisplayURL}`,
    }),
    getPagesWithOffset: builder.query<
      IPageResponse,
      IGetPagesWithOffsetRequest
    >({
      query: ({ PG_Number, PG_Limit }) =>
        `${url}/?pg_page_number=${PG_Number}&pg_page_limit=${PG_Limit}`,
      providesTags: (result) => {
        return result?.data?.Pages
          ? [
              ...result?.data?.Pages.map((page) => ({
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
    getPageWithPagination: builder.query<ISinglePageResponse, IPageGetRequest>({
      query: ({ PG_DisplayURL, PG_PageNumber, PG_PageOffset }) => {
        if (PG_DisplayURL == 'user-profile') {
          return `${url}/with-pagination/${'news'}?pg_page_number=${PG_PageNumber}`;
        }

        let queryString = `${url}/with-pagination/${PG_DisplayURL}?pg_page_number=${PG_PageNumber}`;
        if (PG_PageOffset !== undefined) {
          queryString += `&pg_page_offset=${PG_PageOffset}`;
        }

        return queryString;
      },
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
  useGetUsersQuery,
  // useGetPageWithPaginationQuery,
  useGetPageColumnsByDisplayUrlQuery,
} = pageApi;
