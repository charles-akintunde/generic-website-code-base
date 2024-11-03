import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-hooks';
import {
  removePageContent,
  setCurrentPageContent,
  setCurrentUserPage,
  setEditingPageContent,
  setPageContentImageURL,
} from '../../store/slice/pageSlice';
import {
  IPageContentImage,
  IPageContentItem,
  IPageContentMain,
  IPageMain,
  RootState,
} from '../../types/componentInterfaces';
import {
  useCreatePageContentMutation,
  useGetPageContentQuery,
  useDeletePageContentMutation,
  useEditPageContentMutation,
  useUploadPageContentMutation,
} from '../../api/pageContentApi';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../components/hoc/notification-provider';
import usePage from './use-page';
import { usePathname } from 'next/navigation';
import { EPageType } from '../../types/enums';
import { IPageContentGetRequest } from '../../types/requestInterfaces';
import { formatDateWithZeroTime, toKebabCase } from '../../utils/helper';

interface IUsePageContentProps {
  pageContent?: IPageContentGetRequest;
  pageDisplayURL?: string;
  // setPageContents?: React.Dispatch<React.SetStateAction<IPageContentMain[]>>;
}

const usePageContent = ({
  pageContent,

  // setPageContents,
}: IUsePageContentProps = {}) => {
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [
    uploadPageContentImage,
    {
      isError: hasUploadPageContentImageError,
      isSuccess: isUploadPageContentImageSuccess,
      isLoading: isUploadPageContentImageLoading,
    },
  ] = useUploadPageContentMutation();
  const {} = usePage({ pageDisplayURL: pageName });
  const [pageContents, setPageContents] = useState<IPageContentMain[]>([]);
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
  const pageDisplayURL = pathname.split('/')[1];
  const fetchedPageContents = useAppSelector(
    (state: RootState) => state.page.pageContents
  );
  const sortedPageContents = [...fetchedPageContents].sort((a, b) => {
    const dateA = a.pageContentCreatedAt
      ? new Date(a.pageContentCreatedAt).getTime()
      : 0;
    const dateB = b.pageContentCreatedAt
      ? new Date(b.pageContentCreatedAt).getTime()
      : 0;

    return dateB - dateA;
  });
  // const {
  //   data: pageContentsData,
  //   isError: hasPageContentsFetchError,
  //   isLoading: isPageContentsFetchLoading,
  //   isFetching: isPageContentFetching,
  //   status: pageContentFetchStatus,
  //   error: pageContentsFetchError,
  //   refetch: refetchPageContent,
  //   isSuccess: isPageContentsFetchSuccess,
  // } = useGetPageWithPaginationQuery(
  //   {
  //     PG_DisplayURL: pageDisplayURL ?? '',
  //     PG_PageNumber: pageNumber,
  //   },
  //   {
  //     skip: false,
  //     refetchOnMountOrArgChange: true,
  //   }
  // );

  // useEffect(() => {
  //   if (!pageContentsData) {
  //     console.log('No page content data available');

  //     return;
  //   }

  //   if (pageContentsData.data) {
  //     const responseData = pageContentsData.data;
  //     const dynamicPage = normalizeMultiContentPage(responseData, false);
  //     const newPageContents = dynamicPage.pageContents as IPageContentMain[];

  //     setPageContents((prevContents) => {
  //       const uniqueNewPageContents = newPageContents.filter(
  //         (newContent) =>
  //           !prevContents.some(
  //             (existingContent) =>
  //               existingContent.pageContentId === newContent.pageContentId
  //           )
  //       );

  //       return uniqueNewPageContents.length > 0
  //         ? [...prevContents, ...uniqueNewPageContents]
  //         : prevContents;
  //     });

  //     const fetchingPageData: IFetchedPage = {
  //       fetchedPage: dynamicPage,
  //       isPageFetchLoading: isPageContentFetchLoading,
  //       hasPageFetchError: hasPageContentFetchError,
  //       pageFetchError: pageContentFetchError,
  //     };
  //     dispatch(setFecthingPageData(fetchingPageData));

  //     if (newPageContents.length < 8) setHasMore(false);
  //   }
  // }, [isPageContentsFetchSuccess, pageContentsData?.data]);

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
        pageContent.pageContentCreatedAt &&
        pageContent.pageType == EPageType.PageList
      ) {
        const date = new Date(pageContent.pageContentCreatedAt);
        const formattedDate = formatDateWithZeroTime(date);

        formData.append('PC_CreatedAt', formattedDate);
      }

      if (
        pageContent.pageContentUsersId &&
        Array.isArray(pageContent.pageContentUsersId)
      ) {
        formData.append(
          'PC_UsersId',
          JSON.stringify(pageContent.pageContentUsersId)
        );
      }

      if (
        pageContent.pageType == EPageType.ResList &&
        pageContent.pageContentResource
      ) {
        formData.append('PC_Resource', pageContent.pageContentResource);
      } else if (pageContent.pageType == EPageType.PageList) {
        formData.append('PC_DisplayURL', pageContent.pageContentDisplayURL);
      }
      // @ts-ignore
      const response = await createPageContent(formData).unwrap();

      if (pageContentFetchRefetch) pageContentFetchRefetch();

      if (pageContent.pageType == EPageType.PageList) {
        router.replace(
          `/${pageContent.pageName}/${pageContent.pageContentDisplayURL}`
        );
      }

      dispatch(
        setCurrentUserPage({
          isModalOpen: false,
        })
      );

      notify(
        'Success',
        response.message || 'The page content has been created successfully.',
        'success'
      );

      // if (pageContent.pageType == EPageType.ResList) {
      //   reloadPage();
      // }
    } catch (error: any) {
      console.log(error, 'ERROR');
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
          'Failed to page content the page. Please try again later.',
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
      // @ts-ignore
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
      let pageContentObj = {
        ['PC_Content']: pageContent.editorContent,
      };

      if (pageContent.pageContentName) {
        formData.append('PC_Title', pageContent.pageContentName);
      }
      if (pageContent.pageContentDisplayImage) {
        formData.append('PC_ThumbImg', pageContent.pageContentDisplayImage);
      }
      if (pageType != EPageType.ResList && pageContent.pageContentDisplayURL) {
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
      if (pageContent.pageContentCreatedAt && pageType == EPageType.PageList) {
        const date = new Date(pageContent.pageContentCreatedAt);
        const formattedDate = formatDateWithZeroTime(date);

        formData.append('PC_CreatedAt', formattedDate);
      }
      if (pageType == EPageType.ResList && pageContent.pageContentResource) {
        formData.append('PC_Resource', pageContent.pageContentResource);
      }

      if (
        pageContent.pageContentUsersId &&
        Array.isArray(pageContent.pageContentUsersId)
      ) {
        formData.append(
          'PC_UsersId',
          JSON.stringify(pageContent.pageContentUsersId)
        );
      }

      const response = await editPageContent({
        PC_ID: pageContentId,
        // @ts-ignore
        formData,
      }).unwrap();

      // setTimeout(() => {

      // }, 200);

      if (
        pageContent.pageContentDisplayURL &&
        pageType == EPageType.PageList &&
        isPageContentFetchSuccess
      ) {
        const newUrl = `/${pageDisplayURL}/${pageContent.pageContentDisplayURL}`;
        router.replace(newUrl);
      }

      dispatch(
        setCurrentUserPage({
          isModalOpen: false,
          pageContent: null,
        })
      );

      notify(
        'Success',
        response.message || 'Changes saved successfully.',
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
      console.log('Deleting...');
      const response = await deletePageContent(pageContentId).unwrap();
      notify(
        'Success',
        response.message || 'The page has been successfully deleted.',
        'success'
      );

      try {
        dispatch(removePageContent(pageContentId));
      } catch (dispatchError) {}
    } catch (error: any) {
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
