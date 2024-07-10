'use client';
import React, { useState } from 'react';
import {
  estimateReadingTime,
  formatDate,
  fromKebabCase,
  getPageExcerpt,
  toKebabCase,
} from '@/utils/helper';
import AppButton from '../button/app-button';
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
import useUserLogin from '@/hooks/api-hooks/use-user-login';

interface ContentListProps {
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
  pageName,
  pageContents,
  canEdit,
  createPageHref,
  ListCardComponent,
  pageNameKebab,
  queryString,
  emptyDescription,
}) => {
  const className = isResourcePage
    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : 'grid-cols-1 md:grid-cols-2';
  return (
    <div className="min-h-screen">
      <div className={`${containerNoFlexPaddingStyles} pt-8`}>
        <header className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-bold">Latest {pageName}</h2>
          {canEdit && (
            <AppButton
              buttonText={`Create ${pageName.toLowerCase()}`}
              Icon={PlusIcon}
              href={createPageHref(pageNameKebab, queryString)}
              classNames={primarySolidButtonStyles}
            />
          )}
        </header>
        {pageContents && pageContents.length > 0 ? (
          <div className={`grid gap-8 ${className}`}>
            {pageContents.map((pageContent, index) => (
              <ListCardComponent
                key={index}
                pageContent={pageContent}
                pageName={pageName.toLowerCase()}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full h-full justify-center items-center">
            <Empty
              description={
                emptyDescription || `No content for ${pageName.toLowerCase()}`
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentList;
