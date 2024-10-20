import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IPageResponse,
  ISinglePageResponse,
  IGenericResponse,
  IPageContentGetResponse,
  IPageContentImageResponse,
} from '../types/backendResponseInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import {
  IPageGetRequest,
  IEditPageContentRequest,
  IPageContentCreateRequest,
  IPageContentGetRequest,
  IPageContentImageRequest,
} from '../types/requestInterfaces';

const url = '/page-contents';
const pageUrl = '/pages';

export const pageContentApi = createApi({
  reducerPath: 'pageContentApi',
  tagTypes: ['Pages', 'Menus', 'Page', 'PageContent', 'SinglePageContent'],
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getPageContent: builder.query<
      IPageContentGetResponse,
      IPageContentGetRequest
    >({
      query: (req) => ({
        url: `${url}/${req.PG_DisplayURL}/${req.PC_DisplayURL}`,
      }),
      providesTags: (result: IPageContentGetResponse | undefined) => {
        return result?.data.PG_PageContent
          ? [
              {
                type: 'SinglePageContent',
                id: result.data.PG_PageContent.PC_ID,
              },
              { type: 'SinglePageContent', id: 'SINGLE_PAGE_CONTENT' },
            ]
          : [{ type: 'SinglePageContent', id: 'SINGLE_PAGE_CONTENT' }];
      },
    }),
    createPageContent: builder.mutation<
      IGenericResponse,
      IPageContentCreateRequest
    >({
      query: (newPageContent) => ({
        url: url,
        method: 'POST',
        body: newPageContent,
      }),
      invalidatesTags: [{ type: 'PageContent', id: 'LIST' }],
    }),
    editPageContent: builder.mutation<
      IPageResponse,
      Partial<IEditPageContentRequest> & Pick<IEditPageContentRequest, 'PC_ID'>
    >({
      query: ({ PC_ID, ...patch }) => ({
        url: `${url}/${PC_ID}`,
        method: 'PUT',
        body: (patch as any).formData,
      }),
      invalidatesTags: (result, error, { PC_ID }) => [
        { type: 'SinglePageContent', id: PC_ID },
        { type: 'SinglePageContent', id: 'SINGLE_PAGE_CONTENT' },
        { type: 'PageContent' as const, id: 'LIST' },
      ],
    }),
    // getPageWithPagination: builder.query<ISinglePageResponse, IPageGetRequest>({
    //   query: ({ PG_DisplayURL, PG_PageNumber }) =>
    //     `${pageUrl}/with-pagination/${PG_DisplayURL}?pg_page_number=${PG_PageNumber}`,
    //   providesTags: (result) =>
    //     result?.data?.PG_PageContents
    //       ? [
    //           ...(result.data.PG_PageContents.map((content) => ({
    //             type: 'PageContent' as const,
    //             id: content.PC_ID,
    //           })) || []),
    //           { type: 'Page' as const, id: result.data.PG_ID },
    //           { type: 'PageContent' as const, id: 'LIST' },
    //           { type: 'Page' as const, id: 'LIST' },
    //         ]
    //       : [
    //           { type: 'Page' as const, id: 'LIST' },
    //           { type: 'PageContent' as const, id: 'LIST' },
    //         ],
    // }),
    getPageWithPagination: builder.query<ISinglePageResponse, IPageGetRequest>({
      query: ({ PG_DisplayURL, PG_PageNumber, PG_PageOffset }) => {
        let queryString = `${'pages'}/with-pagination/${PG_DisplayURL}?pg_page_number=${PG_PageNumber}`;
        if (PG_PageOffset !== undefined) {
          queryString += `&pg_page_offset=${PG_PageOffset}`;
        }

        return queryString;
      },
      providesTags: (result) =>
        result?.data?.PG_PageContents
          ? [
              ...(result.data.PG_PageContents.map((content) => ({
                type: 'PageContent' as const,
                id: content.PC_ID,
              })) || []),
              { type: 'Page' as const, id: result.data.PG_ID },
              { type: 'PageContent' as const, id: 'LIST' },
              { type: 'Page' as const, id: 'LIST' },
              'PageContent',
            ]
          : [
              { type: 'Page' as const, id: 'LIST' },
              { type: 'PageContent' as const, id: 'LIST' },
            ],
    }),
    deletePageContent: builder.mutation<IGenericResponse, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => {
        return [
          { type: 'PageContent', id },
          { type: 'PageContent', id: 'LIST' },
          { type: 'Page', id: 'LIST' },
          'PageContent',
        ];
      },
    }),

    uploadPageContent: builder.mutation<
      IPageContentImageResponse,
      IPageContentImageRequest
    >({
      query: (pageContentImage) => ({
        url: `${url}/upload-page-content-image`,
        method: 'POST',
        body: pageContentImage,
      }),
    }),
  }),
});

export const {
  useCreatePageContentMutation,
  useGetPageContentQuery,
  useDeletePageContentMutation,
  useEditPageContentMutation,
  useUploadPageContentMutation,
  useGetPageWithPaginationQuery,
} = pageContentApi;
