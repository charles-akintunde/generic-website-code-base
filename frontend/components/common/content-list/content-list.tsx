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
import { useGetPageWithPaginationQuery } from '@/api/pageApi';
import {
  handleRoutingOnError,
  normalizeMultiContentPage,
  toKebabCase,
} from '@/utils/helper';
import AppLoading from '../app-loading';

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
  createPageHref: (pageNameKebab: string, queryString: string) => string;
  emptyDescription?: string;
}

const ContentList: React.FC<ContentListProps> = ({
  isResourcePage,
  canEdit,
  ListCardComponent,
  pageName,
  queryString,
  createPageHref,
}) => {
  const className = isResourcePage
    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'grid-cols-1 md:grid-cols-2 gap-8';

  const pathname = window.location.pathname;
  const pageDisplayURL = pathname.split('/')[1];

  const [pageNumber, setPageNumber] = useState(1);
  const [pageContents, setPageContents] = useState<IPageContentMain[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);
  const {
    data: pageData,
    isError: hasPageFetchError,
    isSuccess: isPageFetchSuccess,
    isLoading: isPageFetchLoading,
    error: pageFetchError,
    refetch: pageRefetch,
  } = useGetPageWithPaginationQuery({
    PG_DisplayURL: pageDisplayURL,
    PG_PageNumber: pageNumber,
  });

  useEffect(() => {
    if (pageData && pageData.data) {
      const responseData = pageData.data;
      const pageList = normalizeMultiContentPage(responseData, false);
      const newPageContents = pageList.pageContents as IPageContentMain[];
      setPageContents((prevContents) => [...prevContents, ...newPageContents]);
      if (newPageContents && newPageContents.length < 8) setHasMore(false);
    }
  }, [pageData]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isPageFetchLoading) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    },
    [hasMore, isPageFetchLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    handleRoutingOnError(router, hasPageFetchError, pageFetchError);
  }, [router, hasPageFetchError, pageFetchError]);

  if (isPageFetchLoading) {
    return <AppLoading />;
  }

  return (
    <div className="min-h-screen">
      <div className={`${containerNoFlexPaddingStyles} pt-8`}>
        <header className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-bold">Latest Content</h2>
          {canEdit && (
            <AppButton
              buttonText={`Create Content`}
              Icon={PlusIcon}
              href={createPageHref(pageDisplayURL, queryString)}
              classNames={primarySolidButtonStyles}
            />
          )}
        </header>
        {pageContents.length > 0 ? (
          <div className={`grid ${className}`}>
            {pageContents
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
        {isPageFetchLoading && (
          <div className="flex w-full justify-center py-4">
            <Spin />
          </div>
        )}
        {hasMore && <div ref={observerRef} style={{ height: '20px' }} />}
      </div>
    </div>
  );
};

export default ContentList;
