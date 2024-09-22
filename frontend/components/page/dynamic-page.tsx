'use client';
import React, { useEffect, useState } from 'react';
import PageLayout from './layout';
import PageLists from '@/components/page/page-content/page-lists';
import { usePathname } from 'next/navigation';
import { fromKebabCase, handleRoutingOnError } from '@/utils/helper';
import usePage from '@/hooks/api-hooks/use-page';
import { useRouter } from 'next/navigation';
import SinglePage from '@/components/page/page-content/single-page';
import ResourceLists from '@/components/page/page-content/resource-lists';
import AppLoading from '../common/app-loading';
import { EPageType } from '@/types/enums';

const DynamicPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [pageDisplayURL, setPageDisplayURL] = useState(
    pathname.split('/')['1']
  );
  const {
    currentPage,
    getCurrentPageContents,
    hasPageFetchError,
    isPageFetchLoading,
    pageFetchError,
  } = usePage(pageDisplayURL);
  const pageName = currentPage && (currentPage.pageName as string);
  useEffect(() => {
    if (!isPageFetchLoading) {
      console.log(pageFetchError, hasPageFetchError, 'pageFetchError');
      handleRoutingOnError(router, hasPageFetchError, pageFetchError);
    }
  }, [router, hasPageFetchError, pageFetchError, isPageFetchLoading]);

  console.log(currentPage, 'currentPage');

  if (isPageFetchLoading || !currentPage) {
    return <AppLoading />;
  }
  const renderPageContent = () => {
    switch (currentPage.pageType) {
      case EPageType.SinglePage:
        return <SinglePage />;
      case EPageType.PageList:
        return (
          <PageLayout title={pageName as string}>
            <PageLists />
          </PageLayout>
        );
      case EPageType.ResList:
        return (
          <PageLayout title={pageName as string}>
            <ResourceLists />
          </PageLayout>
        );
      default:
        return <div>Page type not recognized</div>;
    }
  };

  return <>{renderPageContent()}</>;
};

export default DynamicPage;
