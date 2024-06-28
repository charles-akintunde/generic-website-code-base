import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IGenericResponse,
  IPageContentGetResponse,
  IPageContentResponse,
  ISinglePageResponse,
} from '@/types/backendResponseInterfaces';
import publicRouteBaseQuery from './publicRouteBaseQuery';
import { pageTagTypes } from './apiTags';
import {
  IPageContentCreateRequest,
  IPageContentGetRequest,
} from '@/types/requestInterfaces';
import build from 'next/dist/build';

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
      invalidatesTags: [{ type: 'Page', id: 'LIST' }],
    }),
  }),
});

export const { useCreatePageContentMutation, useGetPageContentQuery } =
  pageContentApi;
