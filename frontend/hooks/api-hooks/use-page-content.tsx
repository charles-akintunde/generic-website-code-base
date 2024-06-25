import React from 'react';
import { useAppDispatch } from '../redux-hooks';
import { addPageContent } from '@/store/slice/pageSlice';
import {
  IPageContentItem,
  IPageContentMain,
} from '@/types/componentInterfaces';
import { useCreatePageContentMutation } from '@/api/pageContentApi';
import { IPageContentRequest } from '@/types/requestInterfaces';

const usePageContent = () => {
  const dispatch = useAppDispatch();
  const [
    createPageContent,
    {
      isError: hasCreatePageContentError,
      isSuccess: isCreatePageContentSuccess,
      isLoading: isCreatePageContentLoading,
    },
  ] = useCreatePageContentMutation();

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

      console.log(formData, 'rquest');
      const response = await createPageContent(formData).unwrap();
      console.log(formData, 'response');
    } catch (error: any) {
      console.log(error, 'IPageContentRequest');
    }
  };

  return {
    submitPageContent,
  };
};

export default usePageContent;
