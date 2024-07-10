'use client';
import React, { useState } from 'react';
import PageListCard from './page-list-card';
import { fromKebabCase, toKebabCase } from '@/utils/helper';
import { IPageContentMain, IPageMain } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import ContentList from '../common/content-list/content-list';
import { Card, Button } from 'antd';
import { Icon } from 'lucide-react';
import ActionsButtons from '../common/action-buttons';
import ResourceListCard from './resource-list-card';

const ResourceLists = () => {
  const pathname = usePathname();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  const { canEdit } = useUserLogin();
  const { currentPage, getCurrentPageContents } = usePage(pageName);
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
