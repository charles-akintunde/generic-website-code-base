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
import ResourceList from '../page-content/resource-list';
import AppLoading from '../common/app-loading';

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
      case '0':
        return <SinglePage />;
      case '1':
        return (
          <PageLayout title={pageName}>
            <PageLists />
          </PageLayout>
        );
      case '2':
        return <ResourceList />;
      default:
        return <div>Page type not recognized</div>;
    }
  };

  return <>{renderPageContent()}</>;
};

export default DynamicPage;
