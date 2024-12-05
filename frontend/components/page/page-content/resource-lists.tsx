'use client';
import React, { useState } from 'react';
import { toKebabCase } from '../../../utils/helper';
import { IPageContentMain } from '../../../types/componentInterfaces';
import usePage from '../../../hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import ContentList from '../../common/content-list/content-list';
import ResourceTableList from './resource-table-list';
import { useAppSelector } from '../../../hooks/redux-hooks';
import ContentTableList from '../../common/content-list/content-table-list';

const ResourceLists = () => {
  const pathname = usePathname();
  const [pageDisplayURL, setPageName] = useState(pathname.split('/')['1']);
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const { currentPage } = usePage({ pageName: pageDisplayURL });
  const page = currentPage;
  const pageName = page?.pageName;
  const pageType = (page && page?.pageType) ?? '';
  const createPageHref = (pageNameKebab: string, queryString: string) =>
    `/${pageNameKebab}/create-page-content?${queryString}`;
  const pageNameKebab = toKebabCase(page?.pageName ?? '');
  const pageId = page?.pageId ?? '';
  const pageContents: IPageContentMain[] =
    (page?.pageContents as IPageContentMain[]) ?? [];

  return (
  <ContentTableList
  pageDisplayURL={pageDisplayURL}
  pageId={pageId}
  pageName={pageName as string}
  pageType={pageType}
  />
  );
};

export default ResourceLists;
