import usePage from '@/hooks/api-hooks/use-page';
import {
  containerNoFlexPaddingStyles,
  pageContentPaddingStyles,
  primarySolidButtonStyles,
} from '@/styles/globals';
import {
  createPageContentItem,
  fromKebabCase,
  getChangedFields,
  notifyNoChangesMade,
  pageNormalizer,
  toKebabCase,
} from '@/utils/helper';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '../plate/plate';
import { PlusIcon } from 'lucide-react';
import AppButton from '../common/button/app-button';
import LoadingButton from '../common/button/loading-button';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { IPageContentItem, IPageMain } from '@/types/componentInterfaces';
import { useNotification } from '../hoc/notification-provider';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import { useGetPageContentQuery } from '@/api/pageContentApi';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import AppLoading from '../common/app-loading';
import PageLayout from '../page/layout';

const SinglePage = () => {
  const pathname = usePathname();
  const { notify } = useNotification();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  const {
    data: pageContentData,
    isError: hasPageContentFetchError,
    isSuccess: isPageContentFetchSuccess,
    isLoading: isPageContentFetchLoading,
    error: pageContentFetchError,
    refetch: pageContentFetchRefetch,
  } = useGetPageContentQuery({
    PC_Title: fromKebabCase(pageName),
    PG_Name: fromKebabCase(pageName),
  } as IPageContentGetRequest);
  const { currentUser, currentUserRole } = useUserLogin();
  const [page, setPage] = useState<IPageMain>();
  const isSinglePageCreated =
    page?.pageContents && page?.pageContents.length === 0;
  const [plateEditor, setPlateEditor] = useState([
    {
      id: '1',
      type: 'p',
      children: [{ text: `Enter Content for ${pageName}` }],
    },
  ]);
  const [originalSinglePageData, setOriginalSinglePageData] = useState({
    pageContents: [
      {
        id: '1',
        type: 'p',
        children: [{ text: `Enter Content for ${pageName}` }],
      },
    ],
  });
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );
  const {
    submitPageContent,
    submitEditedPageContent,
    isCreatePageContentSuccess,
  } = usePageContent();
  const { canEdit } = useUserLogin();

  useEffect(() => {
    if (pageContentData && pageContentData.data.PG_PageContent) {
      const page = pageContentData.data;
      const pageContent = page.PG_PageContent;
      if (pageContent) {
        const normalizedPage = pageNormalizer(page, pageContent);
        setPage(normalizedPage);
        setOriginalSinglePageData(normalizedPage.pageContents);
        setPlateEditor(normalizedPage.pageContents.pageContents || plateEditor);
        setPlateEditorKey(
          JSON.stringify(
            normalizedPage.pageContents.pageContents || plateEditor
          )
        );
      }
    }
  }, [pageContentData]);
  const handleSinglePageSubmit = async () => {
    const pageContent = createPageContentItem(
      {
        pageContentName: String(page && page.pageName),
        isPageContentHidden: page && page.pageContents.pageContentDisplayImage,
        pageContentDisplayImage:
          page && page.pageContents.pageContentDisplayImage,
      },
      plateEditor,
      String(page && page.pageId),
      pageName,
      (currentUser && currentUser.Id) as string,
      `${toKebabCase(pageName)}}`
    );
    const newDataWithContents = { pageContents: plateEditor };
    const changedFields = getChangedFields(
      originalSinglePageData,
      newDataWithContents
    );
    if (Object.keys(changedFields).length > 0) {
      await submitPageContent(pageContent);
    } else {
      notifyNoChangesMade(notify);
      return;
    }
    console.log('Create');
    if (isSinglePageCreated) {
    } else {
      await submitEditedPageContent(
        pageName,
        pageName,
        page?.pageContents.pageContentId,
        changedFields,
        pageContentFetchRefetch
      );
    }
  };

  if (isPageContentFetchLoading) {
    return <AppLoading />;
  }

  return (
    <>
      <PageLayout title={page?.pageName as string}>
        <div className={`flex flex-col flex-grow mt-28 min-h-screen`}>
          <div
            className={`${pageContentPaddingStyles} space-y-6 min-h-screen relative bottom-20`}
          >
            <PlateEditor
              key={plateEditorKey}
              value={plateEditor}
              onChange={(value) => {
                setPlateEditor(value);
              }}
            />
          </div>
          <div className="flex mt-4 w-full fixed justify-center items-center bottom-0 z-40 h-20 shadow2xl px-4 sm:px-6 lg:px-8">
            {canEdit && (
              <LoadingButton
                buttonText={`${isSinglePageCreated ? 'Create' : 'Edit'} ${pageName}`}
                loading={false}
                onClick={handleSinglePageSubmit}
              />
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default SinglePage;
