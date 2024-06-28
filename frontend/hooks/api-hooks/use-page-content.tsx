import React, { useEffect } from 'react';
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
} from '@/api/pageContentApi';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { toKebabCase } from '@/utils/helper';

const usePageContent = (pageContent?: IPageContentGetRequest) => {
  const dispatch = useAppDispatch();
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

  const pageContentQueryResult = pageContent
    ? useGetPageContentQuery(pageContent)
    : { data: undefined, isError: false, isSuccess: false, isLoading: false };
  const {
    data: pageContentData,
    isError: hasPageContentFetchError,
    isSuccess: isPageContentFetchSuccess,
    isLoading: isPageContentFetchLoading,
  } = pageContentQueryResult;
  const submitPageContent = async (pageContent: IPageContentItem) => {
    try {
      const formData = new FormData();
      let pageContentObj = {
        ['PC_Content']: pageContent.pageContents,
      };
      formData.append('UI_ID', pageContent.userId);
      formData.append('PG_ID', pageContent.pageId);
      formData.append('PC_Title', pageContent.pageContentName);
      formData.append('PC_DisplayURL', '');
      formData.append('PC_ThumbImg', pageContent.pageContentDisplayImage);
      formData.append('PC_IsHidden', String(pageContent.isPageContentHidden));
      formData.append('PC_Content', JSON.stringify(pageContentObj));

      // console.log(formData, 'rquest');
      const response = await createPageContent(formData).unwrap();
      // console.log(formData, 'response');
    } catch (error: any) {
      console.log(error, 'IPageContentRequest');
    }
  };

  useEffect(() => {
    console.log(pageContentData, 'pageContentData');
    // const { data: page } = pageContentData;

    if (pageContentData && pageContentData.data.PG_PageContent) {
      const page = pageContentData.data;
      const pageContent = page.PG_PageContent;
      console.log(pageContent, 'normalizedPage');
      if (pageContent) {
        const normalizedPage: IPageMain = {
          pageId: page.PG_ID,
          pageName: page.PG_Name,
          pagePermission: page.PG_Permission.map(String),
          pageType: String(page.PG_Type),
          isHidden: false,
          href: `/${toKebabCase(page.PG_Name)}`,
          pageContents: {
            pageContentId: pageContent.PC_ID,
            pageName: page.PG_Name,
            pageId: pageContent.PG_ID,
            userId: pageContent.UI_ID,
            href: `${toKebabCase(page.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
            pageContentName: pageContent.PC_Title,
            pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
            isPageContentHidden: pageContent.PC_IsHidden,
            pageContents: pageContent.PC_Content?.PC_Content,
          },
        };
        dispatch(setCurrentPageContent(normalizedPage));
        // console.log(normalizedPage, 'normalizedPage');
      }

      // Do something with normalizedPage if needed
    }
  }, [pageContentData]);

  const handlePageContentEditButtonClick = (pageContent: IPageContentMain) => {
    dispatch(setEditingPageContent(pageContent));
  };

  return {
    submitPageContent,
    handlePageContentEditButtonClick,
    editingPageContent,
    currentPageContent,
    isPageContentFetchLoading,
    isPageContentFetchSuccess,
    hasPageContentFetchError,
  };
};

export default usePageContent;
