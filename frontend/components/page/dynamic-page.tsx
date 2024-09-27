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
import { useAppSelector } from '@/hooks/redux-hooks';

const DynamicPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [pageDisplayURL, setPageDisplayURL] = useState(
    pathname.split('/')['1']
  );
  const {} = usePage({ pageDisplayURL });
  const fetchingPageData = useAppSelector(
    (state) => state.page.fetchingPageData
  );
  const fetchedPage = fetchingPageData?.fetchedPage;
  const isPageFetchLoading = fetchingPageData?.isPageFetchLoading;
  const hasPageFetchError = fetchingPageData?.hasPageFetchError;
  const pageFetchError = fetchingPageData?.pageFetchError;
  const pageName = fetchedPage && (fetchedPage.pageName as string);
  useEffect(() => {
    if (!isPageFetchLoading) {
      console.log(pageFetchError, hasPageFetchError, 'pageFetchError');
      handleRoutingOnError(
        router,
        hasPageFetchError as boolean,
        pageFetchError
      );
    }
  }, [router, hasPageFetchError, pageFetchError]);

  console.log(fetchedPage, 'fetchedPage');

  if (isPageFetchLoading) {
    return <AppLoading />;
  }
  const renderPageContent = () => {
    if (fetchedPage) {
      switch (fetchedPage.pageType) {
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
    }
  };

  return <>{renderPageContent()}</>;
};

export default DynamicPage;
