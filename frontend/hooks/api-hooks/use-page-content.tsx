import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-hooks';
import {
  setCurrentPageContent,
  setEditingPageContent,
  setPageContentImageURL,
} from '@/store/slice/pageSlice';
import {
  IPageContentImage,
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import {
  useCreatePageContentMutation,
  useGetPageContentQuery,
  useDeletePageContentMutation,
  useEditPageContentMutation,
  useUploadPageContentMutation,
  useGetPageWithPaginationQuery,
} from '@/api/pageContentApi';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import {
  normalizeMultiContentPage,
  reloadPage,
  toKebabCase,
} from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/hoc/notification-provider';
import usePage from './use-page';
import { usePathname } from 'next/navigation';
import { EPageType } from '@/types/enums';

interface IUsePageContentProps {
  pageContent?: IPageContentGetRequest;
  pageDisplayURL?: string;
}

const usePageContent = ({
  pageContent,
  pageDisplayURL,
}: IUsePageContentProps = {}) => {
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const [
    uploadPageContentImage,
    {
      isError: hasUploadPageContentImageError,
      isSuccess: isUploadPageContentImageSuccess,
      isLoading: isUploadPageContentImageLoading,
    },
  ] = useUploadPageContentMutation();
  const { refetchPageContent } = usePage({ pageDisplayURL: pageName });
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
  const [pageNumber, setPageNumber] = useState(1);
  const [allowReloadPage, setAllowReloadPage] = useState(false);
  const [pageDisplayURL1, setPageDisplayURL] = useState();
  const [pageContents, setPageContents] = useState<IPageContentMain[]>([]);
  const [hasMore, setHasMore] = useState(true);

  //const [pageContentImageURL, setPageContentImageURL] = useState<string>('');

  // useEffect(() => {
  //   if (allowReloadPage) {
  //     reloadPage();
  //   }

  //   console.log('RELOAD MEEEEE');
  // }, [router]);

  // useEffect(() => {
  //   if (pageData && pageData.data) {
  //     const responseData = pageData.data;
  //     const pageList = normalizeMultiContentPage(responseData, false);
  //     const newPageContents = pageList.pageContents as IPageContentMain[];
  //     setPageContents((prevContents) => [...prevContents, ...newPageContents]);
  //     if (newPageContents.length < 8) setHasMore(false);
  //   }
  // }, [pageData]);

  const submitPageContent = async (
    pageContent: IPageContentItem,
    pageContentFetchRefetch?: () => {}
  ) => {
    try {
      const formData = new FormData();
      let pageContentObj = {
        ['PC_Content']: pageContent.editorContent,
      };
      formData.append('UI_ID', pageContent.userId);
      formData.append('PG_ID', pageContent.pageId);
      formData.append('PC_Title', pageContent.pageContentName);
      if (pageContent.pageContentDisplayImage) {
        formData.append('PC_ThumbImg', pageContent.pageContentDisplayImage);
      }
      formData.append('PC_IsHidden', String(pageContent.isPageContentHidden));
      if (pageContent.pageType && pageContent.pageType != EPageType.ResList) {
        formData.append('PC_Content', JSON.stringify(pageContentObj));
      }

      if (
        pageContent.pageType == EPageType.ResList &&
        pageContent.pageContentResource
      ) {
        formData.append('PC_Resource', pageContent.pageContentResource);
      } else if (pageContent.pageType == EPageType.PageList) {
        formData.append('PC_DisplayURL', pageContent.pageContentDisplayURL);
      }
      const response = await createPageContent(formData).unwrap();
      if (pageContentFetchRefetch) pageContentFetchRefetch();

      if (pageContent.pageType == EPageType.ResList) {
        router.replace(`/${pageContent.pageName}`);
        setAllowReloadPage(true);
      } else if (pageContent.pageType != EPageType.SinglePage) {
        router.replace(
          `/${pageContent.pageName}/${pageContent.pageContentDisplayURL}`
        );
      }
      await refetchPageContent();
      notify(
        'Success',
        response.message || 'The page has been updated successfully.',
        'success'
      );
    } catch (error: any) {
      console.log(error, 'ERROR');
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
          'Failed to update the page. Please try again later.',
        'error'
      );
    }
  };

  const submitUploadPageContentImage = async (
    pageContentImage: IPageContentImage
  ) => {
    try {
      const formData = new FormData();
      formData.append('PC_PageContentImg', pageContentImage.pageContentImage);
      const response = await uploadPageContentImage(formData).unwrap();
      dispatch(setPageContentImageURL(response.data.PC_PageContentURL));
      notify(
        'Success',
        response.message || 'The page has been updated successfully.',
        'success'
      );
    } catch (error: any) {
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
          'Failed to update the page. Please try again later.',
        'error'
      );
    }
  };

  const submitEditedPageContent = async (
    pageDisplayURL: string,
    pageType: string,
    pageContentDisplayURL: string,
    pageContentId: string,
    pageContent: Partial<IPageContentItem>,
    singlePageRefetch: () => {}
  ) => {
    try {
      const formData = new FormData();
      console.log(pageContent, 'pageContent');
      let pageContentObj = {
        ['PC_Content']: pageContent.editorContent,
      };

      if (pageContent.pageContentName) {
        formData.append('PC_Title', pageContent.pageContentName);
      }
      if (pageContent.pageContentDisplayImage) {
        formData.append('PC_ThumbImg', pageContent.pageContentDisplayImage);
      }

      if (pageContent.pageContentDisplayURL) {
        formData.append('PC_DisplayURL', pageContent.pageContentDisplayURL);
      }
      if (pageContent.isPageContentHidden !== undefined) {
        formData.append('PC_IsHidden', String(pageContent.isPageContentHidden));
      }
      if (pageType != EPageType.ResList) {
        if (pageContent.editorContent) {
          formData.append('PC_Content', JSON.stringify(pageContentObj));
        }
      }
      if (pageType == EPageType.ResList && pageContent.pageContentResource) {
        formData.append('PC_Resource', pageContent.pageContentResource);
      }

      const response = await editPageContent({
        PC_ID: pageContentId,
        formData,
      }).unwrap();

      if (
        pageContent.pageContentDisplayURL &&
        pageType != EPageType.SinglePage
      ) {
        router.replace(
          `/${pageDisplayURL}/${pageContent.pageContentDisplayURL}`
        );
      } else {
        singlePageRefetch();
      }

      notify(
        'Success',
        response.message || 'The page has been updated successfully.',
        'success'
      );
      await pageRefetch();
    } catch (error: any) {
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
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
    }
  }, [pageContentData]);

  const handlePageContentEditButtonClick = (pageContent: IPageContentMain) => {
    dispatch(setEditingPageContent(pageContent));
  };

  const handleRemovePageContent = async (pageContentId: string) => {
    try {
      const response = await deletePageContent(pageContentId).unwrap();
      notify(
        'Success',
        response.message || 'The page has been successfully deleted.',
        'success'
      );
      reloadPage();
    } catch (error: any) {
      console.log(error);
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
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
    pageContentFetchRefetch,
    submitUploadPageContentImage,
    uploadPageContentImage,
    isUploadPageContentImageLoading,
    pageContents,

    hasMore,
    setPageNumber,
  };
};

export default usePageContent;
