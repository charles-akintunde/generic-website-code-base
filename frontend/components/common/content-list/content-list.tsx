'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Spin, Empty } from 'antd';
import AppButton from '../button/app-button';
import { PlusIcon } from 'lucide-react';
import {
  containerNoFlexPaddingStyles,
  primarySolidButtonStyles,
} from '@/styles/globals';
import { IPageContentMain } from '@/types/componentInterfaces';
import { useRouter } from 'next/navigation';
import { useGetPageWithPaginationQuery } from '@/api/pageContentApi';
import {
  handleRoutingOnError,
  normalizeMultiContentPage,
  toKebabCase,
} from '@/utils/helper';
import AppLoading from '../app-loading';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import usePage from '@/hooks/api-hooks/use-page';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { EPageType } from '@/types/enums';
import { CreatePageContentModal } from '../form/create-page-content';
import { setCurrentUserPage } from '@/store/slice/pageSlice';

interface ContentListProps {
  pageType: string;
  isResourcePage?: boolean;
  pageName: string;
  pageContents: IPageContentMain[];
  canEdit: boolean;
  queryString: string;
  pageNameKebab: string;
  ListCardComponent: React.FC<{
    pageContent: IPageContentMain;
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
  const className = isResourcePage
    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'grid-cols-1 md:grid-cols-2 gap-8';
  const pathname = window.location.pathname;
  const pageDisplayURL = pathname.split('/')[1];
  const { hasMore, setPageNumber, pageContents } = usePage({ pageDisplayURL });
  const fetchingPageData = useAppSelector(
    (state) => state.page.fetchingPageData
  );
  const fetchingPageContentData = useAppSelector(
    (state) => state.page.fetchedPageContents
  );

  const fetchedPage = fetchingPageData?.fetchedPage;
  const isPageFetchLoading = fetchingPageData?.isPageFetchLoading;
  const hasPageFetchError = fetchingPageData?.hasPageFetchError;
  const pageFetchError = fetchingPageData?.pageFetchError;
  const fetchedPageContents = pageContents;
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

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
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '350px',
      threshold: 0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    handleRoutingOnError(router, hasPageFetchError as boolean, pageFetchError);
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

  console.log(pageType, 'PAGE TYPE');

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
        {fetchedPageContents && fetchedPageContents.length > 0 ? (
          <div className={`grid ${className}`}>
            {fetchedPageContents
              .filter(
                (pageContent) => canEdit || !pageContent.isPageContentHidden
              )
              .map((pageContent, index) => (
                <ListCardComponent
                  pageName={pageName}
                  key={index}
                  pageContent={pageContent}
                />
              ))}
          </div>
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
