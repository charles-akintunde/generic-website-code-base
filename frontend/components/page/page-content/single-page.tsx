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
  normalizeMultiContentPage,
  notifyNoChangesMade,
  pageNormalizer,
  toKebabCase,
} from '@/utils/helper';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '@/components/plate/plate';
import { PlusIcon, Router } from 'lucide-react';
import AppButton from '@/components/common/button/app-button';
import LoadingButton from '@/components/common/button/loading-button';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import { useNotification } from '@/components/hoc/notification-provider';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import { useGetPageContentQuery } from '@/api/pageContentApi';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import AppLoading from '@/components/common/app-loading';
import PageLayout from '@/components/page/layout';
import { TElement } from '@udecode/plate-common';
import { useGetPageQuery } from '@/api/pageApi';
import { Page } from '@/types/backendResponseInterfaces';
import { boolean } from 'zod';

const SinglePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useNotification();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  // const {
  //   data: pageContentData,
  //   isError: hasPageContentFetchError,
  //   isSuccess: isPageContentFetchSuccess,
  //   isLoading: isPageContentFetchLoading,
  //   error: pageContentFetchError,
  //   refetch: pageContentFetchRefetch,
  // } = useGetPageContentQuery({
  //   PC_Title: fromKebabCase(pageName),
  //   PG_Name: fromKebabCase(pageName),
  // } as IPageContentGetRequest);
  const {
    data: pageData,
    isError: hasPageFetchError,
    isSuccess: isPageFetchSuccess,
    isLoading: isPageFetchLoading,
    refetch: pageRefetch,
  } = useGetPageQuery(pageName);
  const { currentUser, currentUserRole } = useUserLogin();
  const [page, setPage] = useState<IPageMain>();
  const [singlePageContent, setSinglePageContent] =
    useState<IPageContentMain>();
  const [isSinglePageCreated, useIsSinglePageCreated] = useState<boolean>(
    singlePageContent ? true : false
  );
  const [plateEditor, setPlateEditor] = useState<TElement[]>([
    {
      id: '1',
      type: 'p',
      children: [{ text: `Enter Content for ${pageName}` }],
    },
  ]);
  const [originalSinglePageData, setOriginalSinglePageData] = useState<
    TElement[]
  >([
    {
      id: '1',
      type: 'p',
      children: [{ text: `Enter Content for ${pageName}` }],
    },
  ]);
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );
  const {
    submitPageContent,
    submitEditedPageContent,
    isCreatePageContentSuccess,
  } = usePageContent();
  const { canEdit } = useUserLogin();

  const [singlePage, setSinglePage] = useState<IPageMain>();
  //const pageContentId: string = contentData!.pageContentId!;

  useEffect(() => {
    if (pageData && pageData.data) {
      let response: Page = pageData.data;
      console.log(response, 'respppppppp');

      const normalizedPage = normalizeMultiContentPage(response, true);
      setSinglePage(normalizedPage);
      setPage(normalizedPage);
      const singlePageContent: IPageContentMain =
        normalizedPage.pageContents && normalizedPage.pageContents[0];
      console.log(normalizedPage, 'normalizedPage');
      console.log(singlePageContent, 'singlePageContent');

      if (singlePageContent) {
        setOriginalSinglePageData(singlePageContent.editorContent);
        useIsSinglePageCreated(true);
        setSinglePageContent(singlePageContent);

        setPlateEditor(singlePageContent.editorContent || plateEditor);
        setPlateEditorKey(
          JSON.stringify(singlePageContent.editorContent || plateEditor)
        );
      }

      //  setCurrentPage(normalizedPage);
    }
  }, [pageData]);

  const handleSinglePageSubmit = async () => {
    console.log(singlePageContent, 'singlePageContent');
    const pageContentId = singlePageContent && singlePageContent.pageContentId;
    const pageContentName = page?.pageName;
    const isPageContentHidden = false;
    const pageContentDisplayImage =
      singlePageContent && singlePageContent.pageContentDisplayImage;
    const pageId = String(page?.pageId);
    const pageType = String(page?.pageType);
    const userId = currentUser?.Id as string;
    const kebabCasePageName = `/${toKebabCase(pageName)}`;
    const pageContent = createPageContentItem(
      {
        pageContentName,
        isPageContentHidden,
        pageContentDisplayImage,
      },
      plateEditor,
      pageId,
      pageType,
      pageName,
      userId,

      kebabCasePageName
    );
    const newDataWithContents = { editorContent: plateEditor };
    const originalData = { editorContent: originalSinglePageData };
    const changedFields = getChangedFields(originalData, newDataWithContents);
    if (Object.keys(changedFields).length > 0) {
      if (isSinglePageCreated) {
        console.log(isSinglePageCreated, 'Edit');
        await submitEditedPageContent(
          pageName,
          pageType,
          pageName,
          String(pageContentId),
          changedFields as Partial<IPageContentItem>,
          pageRefetch
        );
        console.log(
          pageName,
          pageName,
          String(pageContentId),
          changedFields as Partial<IPageContentItem>
        );
      } else {
        console.log(isSinglePageCreated, 'Create');
        console.log(pageContent, 'pageId');
        // await submitPageContent(pageContent, pageRefetch);
      }
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  if (isPageFetchLoading) {
    return <AppLoading />;
  }

  useEffect(() => {
    if (hasPageFetchError) {
      router.push('/404');
    }
  });

  return (
    <>
      <PageLayout
        type="singlePage"
        title={`${!isSinglePageCreated ? 'Edit' : ''} ${fromKebabCase(pageName)}`}
      >
        <div
          className={`flex flex-col min-h-screen w-full ${pageContentPaddingStyles}`}
        >
          <div className={`space-y-6 mb-10 min-h-screen `}>
            <PlateEditor
              key={plateEditorKey}
              value={plateEditor}
              onChange={(value) => {
                setPlateEditor(value);
              }}
            />
          </div>
          {canEdit && (
            <div
              className={`w-full sticky bg-white flex mx-auto bottom-0 z-40 h-20 shadow2xl`}
            >
              <LoadingButton
                className=""
                buttonText="Edit Content"
                loading={false}
              />
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default SinglePage;
