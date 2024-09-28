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
  useGetPageWithPaginationQuery,
} from '@/api/pageApi';
import {
  normalizeMultiContentPage,
  reloadPage,
  toKebabCase,
} from '@/utils/helper';
import { Page } from '@/types/backendResponseInterfaces';
import { IPageRequest } from '@/types/requestInterfaces';
import { useNotification } from '@/components/hoc/notification-provider';
import { routes, systemMenuItems } from '@/components/hoc/layout/menu-items';
import { MenuProps } from 'antd';
import Link from 'next/link';

interface usePageProps {
  pageName?: string;
  pageDisplayURL?: string;
  // pageOffset?: number;
}

type MenuItem = Required<MenuProps>['items'][number];

const usePage = ({ pageName, pageDisplayURL }: usePageProps = {}) => {
  const {
    data: pagesData,
    isError: hasPagesFetchError,
    isSuccess: isPagesFetchSuccess,
    isLoading: isPagesFetchLoading,
  } = useGetPagesQuery();

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
    error: pageContentFetchError,
    refetch: refetchPageContent,
  } = useGetPageWithPaginationQuery(
    {
      PG_DisplayURL: pageDisplayURL ?? '',
      PG_PageNumber: pageNumber,
    },
    {
      skip: !pageDisplayURL,
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

  useEffect(() => {
    if (pageContentData && pageContentData.data) {
      const responseData = pageContentData.data;
      const dynamicPage = normalizeMultiContentPage(responseData, false);
      const newPageContents = dynamicPage.pageContents as IPageContentMain[];
      setPageContents((prevContents) => [...prevContents, ...newPageContents]);
      console.log(pageContents, 'pageContents');
      const fetchingPageData: IFetchedPage = {
        fetchedPage: dynamicPage,
        isPageFetchLoading: isPageContentFetchLoading,
        hasPageFetchError: hasPageContentFetchError,
        pageFetchError: pageContentFetchError,
      };
      dispatch(setFecthingPageData(fetchingPageData));
      if (newPageContents.length < 8) setHasMore(false);
    }
  }, [pageContentData]);

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
      const allRoutes = [...routes, ...normalizedPages];
      const combinedMenuItems = [...systemMenuItems, ...normalizedPages];
      const visibleMenuItems = combinedMenuItems.filter(
        (item) => item.isHidden == false
      );
      const navMenuItems: MenuItem[] = visibleMenuItems.map(
        (menuItem: IPageMenuItem, index) => ({
          label: (
            <div
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
      console.log(normalizedPage, 'normalizedPage');
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
      console.log(editPageRequest, 'editPageRequest');
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
      console.log(page, 'page');
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
    isPageContentFetchLoading,
    hasPageContentFetchError,
    pageContentFetchError,
    hasMore,
    setPageNumber,
    refetchPageContent,
  };
};

export default usePage;
