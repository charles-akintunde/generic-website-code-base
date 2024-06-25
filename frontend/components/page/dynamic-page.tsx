'use client';
import React, { useEffect, useState } from 'react';
import PageLayout from './layout';
import PageContents from '../page-content/page-contents';
import { usePathname } from 'next/navigation';
import { fromKebabCase } from '@/utils/helper';
import { IPageContentItem } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';

const DynamicPage = () => {
  const pathname = usePathname();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  const { currentPage, getCurrentPageContents } = usePage(pageName);

  console.log(pageName, 'EEEEEEEEEEEE');
  console.log(currentPage);

  return (
    <PageLayout title={pageName}>
      <PageContents page={currentPage && currentPage} />
    </PageLayout>
  );
};

export default DynamicPage;
