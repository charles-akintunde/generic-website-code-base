import { pageContentPaddingStyles } from '@/styles/globals';
import {
  createPageContentItem,
  fromKebabCase,
  getChangedFields,
  handleRoutingOnError,
  normalizeMultiContentPage,
  notifyNoChangesMade,
  toKebabCase,
} from '@/utils/helper';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '@/components/plate/plate';
import LoadingButton from '@/components/common/button/loading-button';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import { useNotification } from '@/components/hoc/notification-provider';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import AppLoading from '@/components/common/app-loading';
import PageLayout from '@/components/page/layout';
import { TElement } from '@udecode/plate-common';
import { useGetPageQuery } from '@/api/pageApi';
import { Page } from '@/types/backendResponseInterfaces';
import { useAppSelector } from '@/hooks/redux-hooks';

const SinglePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useNotification();
  const [pageName, setPageName] = useState(pathname.split('/')['1']);
  console.log(pageName, 'pageName');
  const {
    data: pageData,
    isError: hasPageFetchError,
    error: pageFetchError,
    isSuccess: isPageFetchSuccess,
    isLoading: isPageFetchLoading,
    refetch: pageRefetch,
  } = useGetPageQuery(pageName);
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
  const { submitEditedPageContent } = usePageContent();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const uiId = uiActiveUser.uiId;
  const [singlePage, setSinglePage] = useState<IPageMain>();

  useEffect(() => {
    if (pageData && pageData.data) {
      let response: Page = pageData.data;
      const normalizedPage = normalizeMultiContentPage(response, true);
      console.log(normalizedPage.pageDisplayURL, 'normalizedPage');
      setSinglePage(normalizedPage);
      setPage(normalizedPage);
      const singlePageContent: IPageContentMain =
        (normalizedPage.pageContents &&
          normalizedPage.pageContents[0]) as IPageContentMain;

      if (singlePageContent) {
        setOriginalSinglePageData(singlePageContent.editorContent);
        useIsSinglePageCreated(true);
        setSinglePageContent(singlePageContent);

        setPlateEditor(singlePageContent.editorContent || plateEditor);
        setPlateEditorKey(
          JSON.stringify(singlePageContent.editorContent || plateEditor)
        );
      }
    }
  }, [pageData]);

  const handleSinglePageSubmit = async () => {
    const pageContentId = singlePageContent && singlePageContent.pageContentId;
    const pageContentName = page?.pageName;
    const isPageContentHidden = false;
    const pageContentDisplayImage =
      singlePageContent && singlePageContent.pageContentDisplayImage;
    const pageId = String(page?.pageId);
    const pageType = String(page?.pageType);
    const userId = uiId as string;
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
        changedFields['pageContentDisplayURL'] = singlePage?.pageDisplayURL;
        await submitEditedPageContent(
          pageName,
          pageType,
          singlePage?.pageDisplayURL as string,
          String(pageContentId),
          changedFields as Partial<IPageContentItem>,
          pageRefetch
        );
        console.log(singlePage?.pageDisplayURL as string, 'PPPPPPPPPPPPPPPPPP');
      } else {
        console.log(isSinglePageCreated, 'Create');
        console.log(pageContent, 'pageId');
      }
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  if (isPageFetchLoading) {
    return <AppLoading />;
  }

  console.log(isPageFetchLoading, 'isPageFetchLoading');
  // useEffect(() => {
  //   handleRoutingOnError(router, hasPageFetchError, pageFetchError);
  // }, [hasPageFetchError, router, pageFetchError]);

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
                buttonText="Save Changes"
                loading={isPageFetchLoading}
                onClick={handleSinglePageSubmit}
              />
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default SinglePage;
