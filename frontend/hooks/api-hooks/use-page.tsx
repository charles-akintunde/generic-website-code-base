'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-hooks';
import {
  addPages,
  setEditingPage,
  toggleCreatePageDialog,
  getPageContents,
  getPage,
  setFecthingPageData,
  setFetchedSinglePageData,
  //setFecthingContentData,
} from '@/store/slice/pageSlice';
import {
  IFetchedPage,
  IPageContentMain,
  IPageMain,
  IPageMenuItem,
} from '@/types/componentInterfaces';
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useEditPageMutation,
  useDeletePageMutation,
  useGetPageQuery,
  useGetPageColumnsByDisplayUrlQuery,
} from '@/api/pageApi';
import {
  normalizeMultiContentPage,
  reloadPage,
  toKebabCase,
  transformPageToIPage,
} from '@/utils/helper';
import { Page } from '@/types/backendResponseInterfaces';
import { IPageRequest } from '@/types/requestInterfaces';
import { useNotification } from '@/components/hoc/notification-provider';
import { routes, systemMenuItems } from '@/components/hoc/layout/menu-items';
import { MenuProps } from 'antd';
import Link from 'next/link';
import { useGetPageWithPaginationQuery } from '@/api/pageContentApi';

interface usePageProps {
  pageName?: string;
  pageDisplayURL?: string;
  pageDisplayURLForDynamicPage?: string;
  // pageOffset?: number;
}

type MenuItem = Required<MenuProps>['items'][number];

const usePage = ({
  pageName,
  pageDisplayURL,
  pageDisplayURLForDynamicPage,
}: usePageProps = {}) => {
  const {
    data: pagesData,
    isError: hasPagesFetchError,
    isSuccess: isPagesFetchSuccess,
    isLoading: isPagesFetchLoading,
  } = useGetPagesQuery();

  const {
    data: singlePageColumnsData,
    isError: hasSinglePageColumnsFetchError,
    isSuccess: isSinglePageColumnsFetchSuccess,
    isLoading: isSinglePageColumnsFetchLoading,
    error: singlePageFetchError,
  } = useGetPageColumnsByDisplayUrlQuery(
    { PG_DisplayURL: pageDisplayURLForDynamicPage ?? '' },
    {
      skip: !pageDisplayURLForDynamicPage,
    }
  );

  const { notify } = useNotification();
  const [
    createPage,
    {
      isError: hasCreatePageError,
      isSuccess: isCreatePageSuccess,
      isLoading: isCreatePageLoading,
    },
  ] = useCreatePageMutation();
  const [
    editPage,
    {
      isError: hasEditPageError,
      isSuccess: isEditPageSuccess,
      isLoading: isEditPageLoading,
    },
  ] = useEditPageMutation();
  const [
    deletePage,
    {
      isError: hasDeletePageError,
      isSuccess: isDeletePageSuccess,
      isLoading: isDeletePageLoading,
    },
  ] = useDeletePageMutation();
  const pageQueryResult = pageName
    ? useGetPageQuery(pageName)
    : {
        data: undefined,
        isError: false,
        isSuccess: false,
        isLoading: false,
        error: null,
        refetch: () => {},
      };
  const [pageNumber, setPageNumber] = useState(1);
  const [pageContents, setPageContents] = useState<IPageContentMain[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const {
    data: pageContentData,
    isError: hasPageContentFetchError,
    isLoading: isPageContentFetchLoading,
    isFetching: isPageContentFetching,
    status: pageContentFetchStatus,
    error: pageContentFetchError,
    refetch: refetchPageContent,
    isSuccess: isPageContentFetchSuccess,
  } = useGetPageWithPaginationQuery(
    {
      PG_DisplayURL: pageDisplayURL ?? '',
      PG_PageNumber: pageNumber,
    },
    {
      skip: !pageDisplayURL,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: pageData,
    isError: hasPageFetchError,
    isSuccess: isPageFetchSuccess,
    isLoading: isPageFetchLoading,
    error: pageFetchError,
    refetch: pageRefetch,
  } = pageQueryResult;

  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.page.pages);
  const currentPageContents = useAppSelector(
    (state) => state.page.currentPageContents
  );

  // const currentPage = useAppSelector((state) => state.page.currentPage);
  const [currentPage, setCurrentPage] = useState<IPageMain>();
  const editingPage = useAppSelector((state) => state.page.editingPage);
  const [menuItems, setMenuItems] = useState<IPageMenuItem[]>([]);
  const [allAppRoutes, setAllAppRoutes] = useState<IPageMenuItem[]>([]);
  const [navMenuItems, setNavMenuItems] = useState<MenuItem[]>([]);
  const fetchingPageData = useAppSelector(
    (state) => state.page.fetchingPageData
  );
  const fetchedPage = fetchingPageData?.fetchedPage;
  // console.log(pageContentData, 'Check Data outside useEffect');

  useEffect(() => {
    if (isSinglePageColumnsFetchLoading) {
      dispatch(
        setFetchedSinglePageData({
          fetchedPage: null,
          isPageFetchLoading: true,
          hasPageFetchError: false,
          pageFetchError: undefined,
        })
      );
    }

    if (isSinglePageColumnsFetchSuccess && singlePageColumnsData) {
      const fetchedPage = transformPageToIPage(singlePageColumnsData.data);

      dispatch(
        setFetchedSinglePageData({
          fetchedPage: fetchedPage,
          isPageFetchLoading: false,
          hasPageFetchError: false,
          pageFetchError: undefined,
        })
      );
    }

    if (hasSinglePageColumnsFetchError) {
      dispatch(
        setFetchedSinglePageData({
          fetchedPage: null,
          isPageFetchLoading: false,
          hasPageFetchError: true,
          pageFetchError: singlePageFetchError,
        })
      );
    }
  }, [
    isSinglePageColumnsFetchLoading,
    isSinglePageColumnsFetchSuccess,
    hasSinglePageColumnsFetchError,
    singlePageColumnsData,
    pageFetchError,
    dispatch,
  ]);

  useEffect(() => {
    if (!pageContentData) {
      console.log('No page content data available');

      return;
    }

    if (pageContentData.data) {
      const responseData = pageContentData.data;
      const dynamicPage = normalizeMultiContentPage(responseData, false);
      const newPageContents = dynamicPage.pageContents as IPageContentMain[];

      setPageContents((prevContents) => {
        const uniqueNewPageContents = newPageContents.filter(
          (newContent) =>
            !prevContents.some(
              (existingContent) =>
                existingContent.pageContentId === newContent.pageContentId
            )
        );

        return uniqueNewPageContents.length > 0
          ? [...prevContents, ...uniqueNewPageContents]
          : prevContents;
      });

      // const fetchingPageData: IFetchedPage = {
      //   fetchedPage: dynamicPage,
      //   isPageFetchLoading: isPageContentFetchLoading,
      //   hasPageFetchError: hasPageContentFetchError,
      //   pageFetchError: pageContentFetchError,
      // };
      // dispatch(setFecthingPageData(fetchingPageData));

      if (newPageContents.length < 8) setHasMore(false);
    }
  }, [isPageContentFetchSuccess, pageContentData?.data]);

  useEffect(() => {
    if (pagesData && pagesData.data) {
      const normalizedPages: IPageMain[] = pagesData?.data.Pages.map(
        (page: Page) => ({
          pageId: page.PG_ID,
          pageName: page.PG_Name,
          pagePermission: page.PG_Permission.map((permission) =>
            String(permission)
          ),
          pageType: String(page.PG_Type),
          isHidden: false,
          href: decodeURIComponent(`/${page.PG_DisplayURL}`),
          pageDisplayURL: decodeURIComponent(`/${page.PG_DisplayURL}`),
        })
      );
      const allRoutes = [...routes];
      const combinedMenuItems = [...systemMenuItems];
      const visibleMenuItems = combinedMenuItems.filter(
        (item) => item.isHidden == false
      );
      const navMenuItems: MenuItem[] = visibleMenuItems.map(
        (menuItem: IPageMenuItem, index) => ({
          label: (
            <div
              // onClick={() => reloadPage()}
              className={`transition cursor-pointer duration-300 ease-in-out hover:text-primary transform hover:bg-opacity-50 hover:bg-gray-100 rounded-md px-4`}
            >
              <Link href={`${menuItem.href}`}>{menuItem.pageName}</Link>
            </div>
          ),
          key: `${menuItem.href}`,
        })
      );
      setNavMenuItems(navMenuItems);
      setMenuItems(combinedMenuItems);
      setAllAppRoutes(allRoutes);
      dispatch(addPages(normalizedPages));
    }
  }, [pagesData]);

  useEffect(() => {
    if (pageData && pageData.data) {
      let response: Page = pageData.data;

      const normalizedPage: IPageMain = {
        pageId: response.PG_ID,
        pageName: response.PG_Name,
        pagePermission: response.PG_Permission.map((permission) =>
          String(permission)
        ),
        pageContents:
          response.PG_PageContents &&
          (response.PG_PageContents.map((pageContent) => {
            // @ts-ignore
            const pageContentResponse: IPageContentMain = {
              pageContentId: pageContent.PC_ID,
              pageId: pageContent.PG_ID,
              pageName: response.PG_Name,
              userId: pageContent.UI_ID,
              href: `/${toKebabCase(response.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
              pageContentName: pageContent.PC_Title,
              pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
              pageContentResource: pageContent.PC_ResourceURL as string,
              isPageContentHidden: pageContent.PC_IsHidden,
              pageContentCreatedAt: pageContent.PC_CreatedAt as string,
              pageContentLastUpdatedAt: pageContent.PC_LastUpdatedAt as string,
              editorContent:
                pageContent.PC_Content && pageContent.PC_Content['PC_Content'],
            };
            return pageContentResponse;
          }) as IPageContentMain[]),
        pageType: String(response.PG_Type),
        isHidden: false,
        href: `/${toKebabCase(response.PG_Name)}`,
      };
      setCurrentPage(normalizedPage);
    }
  }, [pageData]);

  const getCurrentPageContents = (pageName: string) => {
    dispatch(getPageContents(pageName));
  };

  const getCurrentPage = (pageName: string) => {
    dispatch(getPage(pageName));
  };

  const submitCreatedPage = async (page: IPageMain) => {
    try {
      const createPageRequest: IPageRequest = {
        PG_Name: page.pageName,
        PG_Permission: page.pagePermission.map((permission) =>
          Number(permission)
        ),
        PG_Type: Number(page.pageType),
        PG_DisplayURL: page.pageDisplayURL as string,
      };
      const response = await createPage(createPageRequest).unwrap();
      notify(
        'Success',
        response.message || 'The page has been successfully created.',
        'success'
      );
      handleToggleCreateFormDialog();
    } catch (error: any) {
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
          'Failed to create the page. Please try again later.',
        'error'
      );
    }
  };

  const submitEditedPage = async (pageId: string, page: IPageMain) => {
    try {
      const editPageRequest: IPageRequest = {
        PG_Name: page.pageName,
        PG_Permission: page.pagePermission.map((permission) =>
          Number(permission)
        ),
        PG_DisplayURL: page.pageDisplayURL as string,
      };
      const response = await editPage({
        PG_ID: pageId,
        PG_Name: editPageRequest.PG_Name,
        PG_Permission: editPageRequest.PG_Permission,
        PG_DisplayURL: editPageRequest.PG_DisplayURL,
      }).unwrap();

      notify(
        'Success',
        response.message || 'The page has been updated successfully.',
        'success'
      );
      handleToggleCreateFormDialog();
    } catch (error: any) {
      notify(
        'Error',
        error.message || 'Failed to update the page. Please try again later.',
        'error'
      );
    }
    // handleToggleCreateFormDialog();
  };

  const handleEditButtonClick = async (page: IPageMain) => {
    handleToggleCreateFormDialog();
    dispatch(setEditingPage(page));
  };

  const handleRemovePage = async (page: IPageMain) => {
    try {
      const response = await deletePage(page.pageId).unwrap();
      notify(
        'Success',
        response.message || 'The page has been successfully deleted.',
        'success'
      );
      reloadPage();
    } catch (error: any) {
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
          'Failed to delete the page. Please try again later.',
        'error'
      );
    }
  };

  const handleToggleCreateFormDialog = () => {
    dispatch(toggleCreatePageDialog());
    dispatch(setEditingPage(null));
  };

  return {
    isEditPageLoading,
    isEditPageSuccess,
    isDeletePageLoading,
    isDeletePageSuccess,
    isCreatePageSuccess,
    isCreatePageLoading,
    submitCreatedPage,
    submitEditedPage,
    pages,
    handleToggleCreateFormDialog,
    handleEditButtonClick,
    editingPage,
    handleRemovePage,
    menuItems,
    allAppRoutes,
    getCurrentPageContents,
    currentPageContents,
    currentPage,
    getCurrentPage,
    pageRefetch,
    hasPagesFetchError,
    hasPageFetchError,
    pageFetchError,
    isPageFetchLoading,
    navMenuItems,
    pageContents,
    // isPageContentFetchLoading,
    // hasPageContentFetchError,
    // pageContentFetchError,
    // hasMore,
    // setPageNumber,
    // refetchPageContent,
  };
};

export default usePage;
