import { containerNoFlexPaddingStyles, pageContentPaddingStyles } from '../../../styles/globals';
import {
  createPageContentItem,
  fromKebabCase,
  getChangedFields,
  handleRoutingOnError,
  normalizeMultiContentPage,
  notifyNoChangesMade,
  toKebabCase,
} from '../../../utils/helper';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '../../plate/plate';
import LoadingButton from '../../common/button/loading-button';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '../../../types/componentInterfaces';
import { useNotification } from '../../hoc/notification-provider';
import usePageContent from '../../../hooks/api-hooks/use-page-content';
import AppLoading from '../../common/app-loading';
import PageLayout from '../layout';
import { TElement } from '@udecode/plate-common';
import { useGetPageQuery } from '../../../api/pageApi';
import { Page } from '../../../types/backendResponseInterfaces';
import { useAppSelector } from '../../../hooks/redux-hooks';
import { useGetPageWithPaginationQuery } from '../../../api/pageContentApi';
import { Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { setUIIsUserEditingMode } from '../../../store/slice/userSlice';

const SinglePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useNotification();
  const [pageDisplayURL, setPageDisplayURL] = useState(pathname.split('/')[1]);
  const {
    data: pageData,
    isError: hasPageFetchError,
    error: pageFetchError,
    isSuccess: isPageFetchSuccess,
    isLoading: isPageFetchLoading,
    refetch: pageRefetch,
  } = useGetPageQuery(pageDisplayURL);
  const {
    data: pageContentsData,
    isError: hasPageContentFetchError,
    isLoading: isPageContentFetchLoading,
    isFetching: isPageContentFetching,
    status: pageContentFetchStatus,
    error: pageContentFetchError,
    refetch: refetchPageContent,
    isSuccess: isPageContentsFetchSuccess,
  } = useGetPageWithPaginationQuery(
    {
      PG_DisplayURL: pageDisplayURL ?? '',
      PG_PageNumber: 1,
    },
    {
      skip: !pageDisplayURL,
      refetchOnMountOrArgChange: true,
    }
  );
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
      children: [{ text: `Enter Content for ${pageDisplayURL}` }],
    },
  ]);
  const [originalSinglePageData, setOriginalSinglePageData] = useState<
    TElement[]
  >([
    {
      id: '1',
      type: 'p',
      children: [{ text: `Enter Content for ${pageDisplayURL}` }],
    },
  ]);
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );
  const dispatch = useDispatch();
  const { submitEditedPageContent } = usePageContent();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const {uiId} = uiActiveUser;
  const [singlePage, setSinglePage] = useState<IPageMain>();
  const [isDataSet, setIsDatSet] = useState<boolean>(false);
  const activeUserProfileEdit = useAppSelector(
    (state) => state.userSlice.uiActiveUserProfileEdit
  );
  const {uiIsAdminInEditingMode} = activeUserProfileEdit;

  useEffect(() => {
    setPageDisplayURL(pathname.split('/')[1]);
  }, [pathname]);

  useEffect(() => {
    if (pageContentsData && pageContentsData?.data) {
      let response: Page = pageContentsData?.data;
      const normalizedPage = normalizeMultiContentPage(response, true);
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
        setIsDatSet(true);
      }
    }
  }, [
    isPageContentsFetchSuccess,
    pageContentsData?.data,
    pageContentsData,
    isPageContentFetchLoading,
    isPageContentFetching,
  ]);

  const handleSinglePageSubmit = async () => {
    const pageContentId = singlePageContent && singlePageContent.pageContentId;

    const pageContentName = page?.pageName;
    const isPageContentHidden = false;
    const pageContentDisplayImage =
      singlePageContent && singlePageContent.pageContentDisplayImage;
    const pageId = String(page?.pageId);
    const pageType = String(page?.pageType);
    const userId = uiId as string;
    const kebabCasePageName = `/${toKebabCase(pageDisplayURL)}`;
    const pageContent = createPageContentItem(
      {
        pageContentName,
        isPageContentHidden,
        pageContentDisplayImage,
      },
      plateEditor,
      pageId,
      pageType,
      pageDisplayURL,
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
          pageDisplayURL,
          pageType,
          singlePage?.pageDisplayURL as string,
          String(pageContentId),
          changedFields as Partial<IPageContentItem>,
          pageRefetch
        );
      } else {
      }
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  useEffect(() => {
    dispatch(
      setUIIsUserEditingMode({
        uiIsAdminInEditingMode: false,
        uiIsPageContentEditingMode: true,
        uiIsUserEditingMode: false,
        uiEditorInProfileMode: false,
       
      })
    );
  },[]);

  const handleModeChange = (checked: boolean) => {
    dispatch(
      setUIIsUserEditingMode({
        uiIsAdminInEditingMode: !uiIsAdminInEditingMode,
        uiIsPageContentEditingMode: true,
        uiIsUserEditingMode: false,
        uiEditorInProfileMode: false,
      })
    );
  };


  useEffect(() => {
    handleRoutingOnError(router, hasPageFetchError, pageFetchError);
  }, [hasPageFetchError, router, pageFetchError]);

  if (isPageFetchLoading || !isDataSet) {
    return <AppLoading />;
  }

  return (
    <>
    <PageLayout
      type="singlePage"
      title={`${!isSinglePageCreated ? 'Edit' : ''} ${fromKebabCase(pageDisplayURL)}`}
    >
      <div
        className={`flex flex-col mt-10 min-h-screen w-full ${containerNoFlexPaddingStyles}`}
      >
        <div className="flex my-6 justify-end w-full">
          {canEdit && (
            <div className="flex justify-end">
              <Switch
                checkedChildren="Editing Mode"
                unCheckedChildren="Viewing Mode"
                checked={uiIsAdminInEditingMode}
                onChange={handleModeChange}
              />
            </div>
          )}
        </div>
  
        <div className={`space-y-6 mb-10 w-full shadow-md`}>
          <PlateEditor
            key={plateEditorKey}
            value={plateEditor}
            onChange={(value) => {
              setPlateEditor(value);
            }}
          />
        </div>
  
        {canEdit && uiIsAdminInEditingMode && (
          <div className={`w-full sticky bg-pg flex mx-auto bottom-0 z-40 h-20 shadow2xl`}>
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
