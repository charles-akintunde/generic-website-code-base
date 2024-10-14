'use client';
import React, { useEffect, useState } from 'react';
import PageLayout from './layout';
import PageLists from '@/components/page/page-content/page-lists';
import { usePathname } from 'next/navigation';
import { handleRoutingOnError } from '@/utils/helper';
import usePage from '@/hooks/api-hooks/use-page';
import { useRouter } from 'next/navigation';
import SinglePage from '@/components/page/page-content/single-page';
import ResourceLists from '@/components/page/page-content/resource-lists';
import AppLoading from '../common/app-loading';
import { EPageType } from '@/types/enums';
import { useAppSelector } from '@/hooks/redux-hooks';
import useHelper from '@/hooks/api-hooks/use-helper';
import { appConfig } from '@/utils/appConfig';
import Head from 'next/head';

const DynamicPage = () => {
  const pathname = usePathname();
  const { clearCache } = useHelper();
  const router = useRouter();
  const [pageDisplayURLForDynamicPage, setPageDisplayURL] = useState(
    pathname.split('/')['1']
  );
  const {} = usePage({ pageDisplayURLForDynamicPage });
  const fetchingPageData = useAppSelector(
    (state) => state.page.fetchingPageData
  );
  const fetchedSinglePageData = useAppSelector(
    (state) => state.page.fetchedSinglePageData
  );
  const { allAppRoutes } = usePage();

  const fetchedPage = fetchedSinglePageData?.fetchedPage;
  const isPageFetchLoading = fetchedSinglePageData?.isPageFetchLoading;
  const hasPageFetchError = fetchedSinglePageData?.hasPageFetchError;
  const pageFetchError = fetchedSinglePageData?.pageFetchError;
  const pageName = fetchedPage && (fetchedPage.pageName as string);
  const currentRouteMeta = allAppRoutes.find(
    (route) => route.href === fetchedPage?.pageDisplayURL
  );

  useEffect(() => {
    handleRoutingOnError(
      router,
      hasPageFetchError as boolean,
      pageFetchError,
      clearCache
    );
  }, [router, hasPageFetchError, pageFetchError]);

  if (isPageFetchLoading || hasPageFetchError) {
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
