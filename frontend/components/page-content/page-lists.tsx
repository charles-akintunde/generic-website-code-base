'use client';
import React, { useState } from 'react';
import PageListCard from './page-list-card';
import {
  estimateReadingTime,
  formatDate,
  fromKebabCase,
  getPageExcerpt,
  toKebabCase,
} from '@/utils/helper';
import AppButton from '../common/button/app-button';
import { PlusIcon } from 'lucide-react';
import {
  containerNoFlexPaddingStyles,
  primarySolidButtonStyles,
} from '@/styles/globals';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import { TElement } from '@udecode/plate-common';
import usePage from '@/hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import { Empty } from 'antd';

interface PageContentProps {
  page: IPageMain | null;
}

const PageLists = () => {
  const pathname = usePathname();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  const { currentPage, getCurrentPageContents } = usePage(pageName);
  const page = currentPage;

  const pageNameKebab = toKebabCase(page?.pageName ?? '');
  const pageId = page?.pageId ?? '';
  const pageContents: IPageContentMain[] =
    (page?.pageContents as IPageContentMain[]) ?? [];
  const queryParams = {
    pageName: pageName,
    pageId: pageId,
  };

  console.log(pageContents, 'pageCOntents');

  const queryString = new URLSearchParams(queryParams).toString();
  return (
    <div className={`${containerNoFlexPaddingStyles} pt-8`}>
      <header className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-bold">Latest {page?.pageName}</h2>
        <AppButton
          buttonText={`Create ${page?.pageName.toLowerCase()}`}
          Icon={PlusIcon}
          href={`/${pageNameKebab}/create-page-content?${queryString}`}
          classNames={primarySolidButtonStyles}
        />
      </header>
      {pageContents && pageContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pageContents.map((pageContent, index) => (
            <PageListCard
              pageContent={pageContent}
              pageName={`${page?.pageName.toLowerCase() ?? ''}`}
              key={index}
              id={pageContent.pageContentId}
              title={pageContent.pageContentName}
              excerpt={getPageExcerpt(pageContent.pageContents)}
              imageSrc={pageContent.pageContentDisplayImage}
              readTime={`${estimateReadingTime(pageContent.pageContents)} mins Read`}
              date={formatDate(pageContent.pageContentCreatedAt as string)}
              href={pageContent.href}
              category={`${page && page.pageName}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <Empty
            description={`No content for ${page?.pageName.toLowerCase()}`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
};

export default PageLists;
