'use client';
import React, { useState } from 'react';
import { toKebabCase } from '@/utils/helper';
import { IPageContentMain } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import ContentList from '@/components/common/content-list/content-list';
import ResourceListCard from './resource-list-card';
import { useAppSelector } from '@/hooks/redux-hooks';

const ResourceLists = () => {
  const pathname = usePathname();
  const [pageName, setPageName] = useState(pathname.split('/')['1']);
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const { currentPage } = usePage({ pageName });
  const page = currentPage;
  const pageType = (page && page?.pageType) ?? '';
  const createPageHref = (pageNameKebab: string, queryString: string) =>
    `/${pageNameKebab}/create-page-content?${queryString}`;
  const pageNameKebab = toKebabCase(page?.pageName ?? '');
  const pageId = page?.pageId ?? '';
  const pageContents: IPageContentMain[] =
    (page?.pageContents as IPageContentMain[]) ?? [];
  const queryParams = {
    pageName: pageName,
    pageType: pageType,
    pageId: pageId,
  };
  const queryString = new URLSearchParams(queryParams).toString();

  return (
    <ContentList
      isResourcePage={true}
      pageType={page?.pageType ?? ''}
      pageName={page?.pageName ?? ''}
      pageContents={pageContents}
      canEdit={canEdit}
      queryString={queryString}
      pageNameKebab={pageNameKebab}
      ListCardComponent={ResourceListCard}
      createPageHref={createPageHref}
      emptyDescription={`No content for ${page?.pageName.toLowerCase()}`}
    />
  );
};

export default ResourceLists;
