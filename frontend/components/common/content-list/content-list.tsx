'use client';
import React from 'react';
import AppButton from '../button/app-button';
import { PlusIcon } from 'lucide-react';
import {
  containerNoFlexPaddingStyles,
  primarySolidButtonStyles,
} from '@/styles/globals';
import { IPageContentMain } from '@/types/componentInterfaces';
import { Empty } from 'antd';
import { useAppSelector } from '@/hooks/redux-hooks';

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
  pageType,
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
    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'grid-cols-1 md:grid-cols-2 gap-8';
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  console.log(pageContents, 'pageContents');

  return (
    <div className="min-h-screen">
      <div className={`${containerNoFlexPaddingStyles} pt-8`}>
        <header className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-bold">Latest </h2>
          {canEdit && (
            <AppButton
              buttonText={`Create Content`}
              Icon={PlusIcon}
              href={createPageHref(pageNameKebab, queryString)}
              classNames={primarySolidButtonStyles}
            />
          )}
        </header>
        {pageContents && pageContents.length > 0 ? (
          canEdit ||
          pageContents.some(
            (pageContent) => !pageContent.isPageContentHidden
          ) ? (
            <div className={`grid ${className}`}>
              {pageContents
                .filter(
                  (pageContent) => canEdit || !pageContent.isPageContentHidden
                )
                .map((pageContent, index) => (
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
          )
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
