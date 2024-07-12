'use client';
import React, { useEffect, useState } from 'react';
import PageLayout from './layout';
import PageLists from '../page-content/page-lists';
import { usePathname } from 'next/navigation';
import { fromKebabCase, hasPermission } from '@/utils/helper';
import { IPageContentItem } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { useRouter } from 'next/navigation';
import SinglePage from '../page-content/single-page';
import ResourceLists from '../page-content/resource-lists';
import AppLoading from '../common/app-loading';
import { EPageType } from '@/types/enums';

const DynamicPage = () => {
  const pathname = usePathname();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  const { currentPage, getCurrentPageContents } = usePage(pageName);

  if (!currentPage) {
    return <AppLoading />;
  }

  const renderPageContent = () => {
    switch (currentPage.pageType) {
      case EPageType.SinglePage:
        return <SinglePage />;
      case EPageType.PageList:
        return (
          <PageLayout title={pageName}>
            <PageLists />
          </PageLayout>
        );
      case EPageType.ResList:
        return (
          <PageLayout title={pageName}>
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
