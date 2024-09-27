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
  const {
    pageContents,
    isPageContentFetchLoading,
    hasPageContentFetchError,
    pageContentFetchError,
    hasMore,
    setPageNumber,
  } = usePage({ pageDisplayURL });

  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isPageContentFetchLoading) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    },
    [hasMore, isPageContentFetchLoading, setPageNumber]
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
    handleRoutingOnError(
      router,
      hasPageContentFetchError,
      pageContentFetchError
    );
  }, [router, hasPageContentFetchError, pageContentFetchError]);

  if (isPageContentFetchLoading) {
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
        {(hasMore || isPageContentFetchLoading) && (
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
