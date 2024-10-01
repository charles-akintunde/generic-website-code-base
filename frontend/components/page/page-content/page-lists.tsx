'use client';
import React, { useEffect, useState } from 'react';
import PageListCard from './page-list-card';
import { handleRoutingOnError, toKebabCase } from '@/utils/helper';
import { IPageContentMain } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import ContentList from '@/components/common/content-list/content-list';
import AppLoading from '@/components/common/app-loading';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux-hooks';

const PageLists = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [pageName, setPageName] = useState(pathname.split('/')['1']);
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const { currentPage, hasPageFetchError, pageFetchError, isPageFetchLoading } =
    usePage({ pageName });
  const page = currentPage;
  const pageType = (page && page?.pageType) ?? '';
  const createPageHref = (pageNameKebab: string, queryString: string) =>
    `/${pageNameKebab}/create-page-content?${queryString}`;
  const pageNameKebab = toKebabCase(page?.pageName ?? '');
  const pageId = page?.pageId ?? '';
  const pageContents: IPageContentMain[] =
    (page?.pageContents as IPageContentMain[]) ?? [];
  const queryParams = {
    pageName: decodeURIComponent(pageName),
    pageType: pageType,
    pageId: pageId,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  useEffect(() => {
    handleRoutingOnError(router, hasPageFetchError, pageFetchError);
  }, [router, hasPageFetchError, pageFetchError]);

  if (isPageFetchLoading) {
    return <AppLoading />;
  }
  return (
    <ContentList
      pageType={page?.pageName ?? ''}
      pageName={page?.pageName ?? ''}
      pageId={pageId}
      pageContents={pageContents}
      canEdit={canEdit}
      queryString={queryString}
      pageNameKebab={pageNameKebab}
      ListCardComponent={PageListCard}
      createPageHref={createPageHref}
      emptyDescription={`No content for ${page?.pageName.toLowerCase()}`}
    />
  );
};

export default PageLists;
