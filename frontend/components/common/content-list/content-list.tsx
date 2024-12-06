'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Spin, Empty } from 'antd';
import AppButton from '../button/app-button';
import { PlusIcon } from 'lucide-react';
import {
  containerNoFlexPaddingStyles,
  primarySolidButtonStyles,
} from '../../../styles/globals';
import {
  IFetchedPage,
  IPageContentMain,
  RootState,
} from '../../../types/componentInterfaces';
import { usePathname, useRouter } from 'next/navigation';
import { useGetPageWithPaginationQuery } from '../../../api/pageContentApi';
import {
  handleRoutingOnError,
  normalizeMultiContentPage,
} from '../../../utils/helper';
import AppLoading from '../app-loading';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { EPageType } from '../../../types/enums';
import { CreatePageContentModal } from '../form/create-page-content';
import {
  addPageContents,
  setCurrentUserPage,
  setFecthingPageData,
  setPageContents,
} from '../../../store/slice/pageSlice';

interface ContentListProps {
  pageType: string;
  isResourcePage?: boolean;
  pageName: string;
  pageContents: IPageContentMain[];
  canEdit: boolean;
  queryString: string;
  pageNameKebab: string;
  ListCardComponent: React.FC<{
    pageContent?: IPageContentMain ;
    pageContents?: IPageContentMain[] ;
    pageName: string;
  }>;
  pageId: string;
  createPageHref: (pageNameKebab: string, queryString: string) => string;
  emptyDescription?: string;
}

const ContentList: React.FC<ContentListProps> = ({
  pageType,
  isResourcePage,
  canEdit,
  ListCardComponent,
  pageName,
  queryString,
  createPageHref,
  pageId,
}) => {
  const dispatch = useAppDispatch();
  // dispatch(setPageContents([]));

  const className = isResourcePage
    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'grid-cols-1 md:grid-cols-2 gap-8';
  const router = useRouter();
  const pathname = usePathname();
  const [pageDisplayURL, setPageDisplayURL] = useState(pathname.split('/')[1]);
  const fetchingPageData = useAppSelector(
    (state) => state.page.fetchingPageData
  );
  const fetchedPageContents = useAppSelector(
    (state: RootState) => state.page.pageContents
  );


  const visiblePageContents = fetchedPageContents.filter(
    (content: any) => !content.deleted
  );
  const sortedPageContents = [...visiblePageContents].sort((a, b) => {
    const dateA = a.pageContentCreatedAt
      ? new Date(a.pageContentCreatedAt).getTime()
      : 0;
    const dateB = b.pageContentCreatedAt
      ? new Date(b.pageContentCreatedAt).getTime()
      : 0;

    return dateB - dateA;
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchedPage = fetchingPageData?.fetchedPage;
  const isPageFetchLoading = fetchingPageData?.isPageFetchLoading;
  const hasPageFetchError = fetchingPageData?.hasPageFetchError;
  const pageFetchError = fetchingPageData?.pageFetchError;

  const observerRef = useRef<HTMLDivElement>(null);
  const {
    data: pageContentsData,
    isError: hasPageContentFetchError,
    isLoading: isPageContentFetchLoading,
    isFetching: isPageContentFetching,
    error: pageContentFetchError,
    isSuccess: isPageContentsFetchSuccess,
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

  useEffect(() => {
    dispatch(setPageContents([]));
    setPageNumber(1);
    setHasMore(true);
    setPageDisplayURL(pathname.split('/')[1]);
  }, [pathname, dispatch]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isPageFetchLoading) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    },
    [hasMore, isPageFetchLoading, setPageNumber]
  );

  useEffect(() => {
    if (!pageContentsData) {
      return;
    }

    if (pageContentsData.data) {
      const responseData = pageContentsData.data;
      const dynamicPage = normalizeMultiContentPage(responseData, false);
      const newPageContents = dynamicPage.pageContents as IPageContentMain[];
      console.log(responseData,"RES")
      //  console.log(newPageContents, 'newPageContents');
      //@ts-ignore
      dispatch(addPageContents(newPageContents));
      const fetchingPageData: IFetchedPage = {
        fetchedPage: dynamicPage,
        isPageFetchLoading: isPageContentFetchLoading,
        hasPageFetchError: hasPageContentFetchError,
        pageFetchError: pageContentFetchError,
      };
      dispatch(setFecthingPageData(fetchingPageData));

      if (newPageContents.length < 8) setHasMore(false);
    }
  }, [
    isPageContentsFetchSuccess,
    pageContentsData?.data,
    isPageContentFetchLoading,
    isPageContentFetching,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '350px',
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // return () => {
    //   if (observerRef.current) observer.unobserve(observerRef.current);
    // };
  }, [handleObserver]);

  useEffect(() => {
    handleRoutingOnError(
      router,
      hasPageFetchError as boolean,
      pageFetchError,
      () => {},
      'CONTENT LISTS'
    );
  }, [router, hasPageFetchError, pageFetchError]);


  

  if (isPageFetchLoading) {
    return <AppLoading />;
  }

  const openCreateContentModal = () => {
    dispatch(
      setCurrentUserPage({
        isModalOpen: true,
        pageId: pageId,
        pageName: pageName,
        pageType: pageType,
        isEditingMode: false,
      })
    );
  };

  return (
    <div className="min-h-screen">
      <div className={`${containerNoFlexPaddingStyles} pt-8`}>
        <header className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-bold">Latest Content</h2>
          {canEdit && (
            <>
              {pageType == EPageType.ResList ? (
                <CreatePageContentModal
                  onClick={openCreateContentModal}
                  pageType={pageType}
                  pageId={pageId}
                />
              ) : (
                <AppButton
                  buttonText={`Create Content`}
                  Icon={PlusIcon}
                  href={createPageHref(pageDisplayURL, queryString)}
                  classNames={primarySolidButtonStyles}
                />
              )}
            </>
          )}
        </header>
        {sortedPageContents && sortedPageContents.length > 0 ? (
          <>
            {pageType == EPageType.ResList ? (
              <>
                <ListCardComponent
                  pageName={pageName}
                  // @ts-ignore
                  pageContents={sortedPageContents}
                />
            </>) : (<div className={`grid ${className}`}>
              {sortedPageContents
              .filter(
                (pageContent) => canEdit || !pageContent.isPageContentHidden
              )
              .map((pageContent, index) => (
                <ListCardComponent
                  pageName={pageName}
                  key={index}
                  // @ts-ignore
                  pageContent={pageContent}
                />
              ))}</div>)}
          
          </>
        ) : (
          <Empty
            description="No content available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
        {(hasMore || isPageFetchLoading) && (
          <div className="flex w-full justify-center py-4">
            <Spin size="small" />
          </div>
        )}
        {hasMore && <div ref={observerRef} style={{ height: '20px' }} />}
      </div>
    </div>
  );
};

export default ContentList;
