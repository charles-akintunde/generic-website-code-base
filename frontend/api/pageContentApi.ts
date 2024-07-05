import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IGenericResponse,
  IPageContentGetResponse,
  IPageContentResponse,
  IPageResponse,
  ISinglePageResponse,
} from '@/types/backendResponseInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import { pageTagTypes } from './apiTags';
import {
  IEditPageContentRequest,
  IPageContentCreateRequest,
  IPageContentGetRequest,
} from '@/types/requestInterfaces';

const url = '/page-contents';

export const pageContentApi = createApi({
  reducerPath: 'pageContentApi',
  tagTypes: pageTagTypes,
  baseQuery: publicRouteBaseQuery,
  endpoints: (builder) => ({
    getPageContent: builder.query<
      IPageContentGetResponse,
      IPageContentGetRequest
    >({
      query: (req) => ({
        url: `${url}/${req.PG_Name}/${req.PC_Title}`,
        providesTags: (result: IPageContentGetResponse) => {
          result.data.PG_PageContent
            ? [
                {
                  type: 'PageContent' as const,
                  id: result.data.PG_PageContent.PC_ID,
                },
                { type: 'PageContent', id: 'LIST' },
              ]
            : [{ type: 'PageContent', id: 'LIST' }];
        },
      }),
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
        body: patch.formData,
      }),
      invalidatesTags: (result, error, { PC_ID }) => [
        { type: 'PageContent', id: PC_ID },
      ],
    }),
    deletePageContent: builder.mutation<IGenericResponse, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'PageContent', id }],
    }),
  }),
});

export const {
  useCreatePageContentMutation,
  useGetPageContentQuery,
  useDeletePageContentMutation,
  useEditPageContentMutation,
} = pageContentApi;
