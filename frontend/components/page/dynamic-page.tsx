'use client';
import React, { useEffect, useState } from 'react';
import PageLayout from './layout';
import PageLists from './page-content/page-lists';
import { usePathname } from 'next/navigation';
import { handleRoutingOnError } from '../../utils/helper';
import usePage from '../../hooks/api-hooks/use-page';
import { useRouter } from 'next/navigation';
import SinglePage from './page-content/single-page';
import ResourceLists from './page-content/resource-lists';
import AppLoading from '../common/app-loading';
import { EPageType } from '../../types/enums';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import useHelper from '../../hooks/api-hooks/use-helper';
import { setFetchedSinglePageData } from '../../store/slice/pageSlice';
import { IPage } from '../../types/componentInterfaces';

const DynamicPage = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { clearCache } = useHelper();
  const router = useRouter();
  const [pageDisplayURLForDynamicPage, setPageDisplayURL] = useState(
    pathname.split('/')['1']
  );
  const {} = usePage({ pageDisplayURLForDynamicPage });
  const fetchedSinglePageData = useAppSelector(
    (state) => state.page.fetchedSinglePageData
  );
  const { allAppRoutes } = usePage();

  const fetchedPage = fetchedSinglePageData?.fetchedPage;
  const isPageFetchLoading = fetchedSinglePageData?.isPageFetchLoading;
  const hasPageFetchError = fetchedSinglePageData?.hasPageFetchError;
  const pageFetchError = fetchedSinglePageData?.pageFetchError;
  const pageName = fetchedPage && (fetchedPage.pageName as string);

  console.log(fetchedPage,"FTAEHED PAGES")

  useEffect(() => {
    if (hasPageFetchError) {
      handleRoutingOnError(
        router,
        hasPageFetchError,
        pageFetchError,
        clearCache,
        'DYNAMIC PAGE',
        () =>
          dispatch(
            setFetchedSinglePageData({
              fetchedPage: fetchedPage as IPage,
              isPageFetchLoading: true,
              hasPageFetchError: false,
              pageFetchError: null,
            })
          )
      );
    }
  }, [router, hasPageFetchError, pageFetchError, pageDisplayURLForDynamicPage]);

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
