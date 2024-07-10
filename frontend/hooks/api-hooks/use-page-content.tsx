import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-hooks';
import {
  addPageContent,
  setCurrentPageContent,
  setEditingPageContent,
} from '@/store/slice/pageSlice';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import {
  useCreatePageContentMutation,
  useGetPageContentQuery,
  useDeletePageContentMutation,
  useEditPageContentMutation,
} from '@/api/pageContentApi';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { fromKebabCase, toKebabCase } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/hoc/notification-provider';
import usePage from './use-page';
import { usePathname } from 'next/navigation';

const usePageContent = (pageContent?: IPageContentGetRequest) => {
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];

  const { pageRefetch } = usePage(fromKebabCase(pageName));
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentPageContent = useAppSelector(
    (state) => state.page.currentPageContent
  );
  const editingPageContent = useAppSelector(
    (state) => state.page.editingPageContent
  );
  const [
    createPageContent,
    {
      isError: hasCreatePageContentError,
      isSuccess: isCreatePageContentSuccess,
      isLoading: isCreatePageContentLoading,
    },
  ] = useCreatePageContentMutation();
  const [
    editPageContent,
    {
      isError: hasEditPageContentError,
      isSuccess: isEditPageContentSuccess,
      isLoading: isEditPageContentLoading,
    },
  ] = useEditPageContentMutation();
  const [
    deletePageContent,
    {
      isError: hasDeletePageContentError,
      isSuccess: isDeletePageContentSuccess,
      isLoading: isDeletePageContentLoading,
    },
  ] = useDeletePageContentMutation();
  const { notify } = useNotification();
  const pageContentQueryResult = pageContent
    ? useGetPageContentQuery(pageContent)
    : {
        data: undefined,
        isError: false,
        isSuccess: false,
        isLoading: false,
        error: undefined,
        refetch: () => {},
      };
  const {
    data: pageContentData,
    isError: hasPageContentFetchError,
    isSuccess: isPageContentFetchSuccess,
    isLoading: isPageContentFetchLoading,
    error: pageContentFetchError,
    refetch: pageContentFetchRefetch,
  } = pageContentQueryResult;

  const submitPageContent = async (
    pageContent: IPageContentItem,
    pageContentFetchRefetch: () => {},
    isSinglePage: boolean = false
  ) => {
    try {
      const formData = new FormData();
      let pageContentObj = {
        ['PC_Content']: pageContent.editorContent,
      };
      formData.append('UI_ID', pageContent.userId);
      formData.append('PG_ID', pageContent.pageId);
      formData.append('PC_Title', pageContent.pageContentName);
      formData.append('PC_DisplayURL', '');
      if (pageContent.pageContentDisplayImage) {
        formData.append('PC_ThumbImg', pageContent.pageContentDisplayImage);
      }
      formData.append('PC_IsHidden', String(pageContent.isPageContentHidden));
      formData.append('PC_Content', JSON.stringify(pageContentObj));

      const response = await createPageContent(formData).unwrap();

      if (!isSinglePage) {
        router.replace(
          `/${toKebabCase(pageContent.pageName)}/${toKebabCase(pageContent.pageContentName)}`
        );
      } else {
        pageContentFetchRefetch();
      }
    } catch (error: any) {
      console.log(error, 'IPageContentRequest');
    }
  };

  const submitEditedPageContent = async (
    pageName: string,
    pageContentName: string,
    pageContentId: string,
    pageContent: Partial<IPageContentItem>,
    singlePageRefetch: () => {}
  ) => {
    try {
      const formData = new FormData();
      let pageContentObj = {
        ['PC_Content']: pageContent.editorContent,
      };

      if (pageContent.pageContentName) {
        formData.append('PC_Title', pageContent.pageContentName);
      }
      if (pageContent.pageContentDisplayImage) {
        formData.append('PC_ThumbImg', pageContent.pageContentDisplayImage);
      }
      if (pageContent.isPageContentHidden !== undefined) {
        formData.append('PC_IsHidden', String(pageContent.isPageContentHidden));
      }
      if (pageContent.editorContent) {
        formData.append('PC_Content', JSON.stringify(pageContentObj));
      }

      const response = await editPageContent({
        PC_ID: pageContentId,
        formData,
      }).unwrap();

      if (pageContent.pageContentName) {
        router.replace(
          `/${toKebabCase(pageName)}/${toKebabCase(pageContentName)}`
        );
      } else {
        await singlePageRefetch();
      }
      await pageRefetch();
      notify(
        'Success',
        response.message || 'The page has been updated successfully.',
        'success'
      );
    } catch (error: any) {
      notify(
        'Error',
        error?.data?.message ||
          'Failed to update the page. Please try again later.',
        'error'
      );
    }
  };

  useEffect(() => {
    if (pageContentData && pageContentData.data.PG_PageContent) {
      const page = pageContentData.data;
      const pageContent = page.PG_PageContent;

      if (pageContent) {
        const normalizedPage: IPageMain = {
          pageId: page.PG_ID,
          pageName: page.PG_Name,
          pagePermission: page.PG_Permission.map(String),
          pageType: String(page.PG_Type),
          isHidden: false,
          href: `/${toKebabCase(page.PG_Name)}`,
          pageContent: {
            pageContentId: pageContent.PC_ID,
            pageName: page.PG_Name,
            pageId: pageContent.PG_ID,
            userId: pageContent.UI_ID,
            href: `${toKebabCase(page.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
            pageContentName: pageContent.PC_Title,
            pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
            isPageContentHidden: pageContent.PC_IsHidden,
            editorContent: pageContent.PC_Content?.PC_Content
              ? pageContent.PC_Content?.PC_Content
              : [
                  {
                    id: '1',
                    type: 'p',
                    children: [{ text: 'Enter Your Content Here...' }],
                  },
                ],
          } as IPageContentMain,
        };
        dispatch(setCurrentPageContent(normalizedPage));
      }

      // Do something with normalizedPage if needed
    }
  }, [pageContentData]);

  const handlePageContentEditButtonClick = (pageContent: IPageContentMain) => {
    dispatch(setEditingPageContent(pageContent));
  };

  const handleRemovePageContent = async (pageContentId: string) => {
    try {
      const response = await deletePageContent(pageContentId).unwrap();

      await pageRefetch();

      notify(
        'Success',
        response.message || 'The page has been successfully deleted.',
        'success'
      );
    } catch (error: any) {
      notify(
        'Error',
        error.data.message ||
          error.data.detail ||
          'Failed to delete the page content. Please try again later.',
        'error'
      );
    }
  };

  return {
    isEditPageContentSuccess,
    isCreatePageContentSuccess,
    submitPageContent,
    submitEditedPageContent,
    handlePageContentEditButtonClick,
    editingPageContent,
    currentPageContent,
    isPageContentFetchLoading,
    isPageContentFetchSuccess,
    hasPageContentFetchError,
    pageContentFetchError,
    handleRemovePageContent,
    // setPlateEditor,
    // plateEditor,
    pageContentFetchRefetch,
  };
};

export default usePageContent;
