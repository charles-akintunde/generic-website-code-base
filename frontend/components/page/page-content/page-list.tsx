'use client';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '@/components/plate/plate';
import PageLayout from '@/components/page/layout';
import FormField from '@/components/common/form-field';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageContentSchema, pageContentSchemaEdit } from '@/utils/formSchema';
import LoadingButton from '@/components/common/button/loading-button';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import {
  IPageContentItem,
  IPageContentMain,
} from '@/types/componentInterfaces';
import { usePathname } from 'next/navigation';
import {
  createPageContentItem,
  fromKebabCase,
  getChangedFields,
  handleRoutingOnError,
  notifyNoChangesMade,
  pageNormalizer,
  toKebabCase,
} from '@/utils/helper';

import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { useSearchParams } from 'next/navigation';
import { useGetPageContentQuery } from '@/api/pageContentApi';
import _ from 'lodash';
import { useNotification } from '@/components/hoc/notification-provider';
import { pageContentPaddingStyles } from '@/styles/globals';
import PageListLayout from './page-list-layout';
import { TElement } from '@udecode/plate-common';
import { EPageType } from '@/types/enums';
import AppLoading from '@/components/common/app-loading';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux-hooks';
import { toKebabCase2 } from '@/utils/helper';

const CreatePageContent = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const [isManualEdit, setIsManualEdit] = useState(false);
  const uiId = uiActiveUser.uiId;
  const [plateEditor, setPlateEditor] = useState<TElement[]>([
    {
      id: '1',
      type: 'p',
      children: [{ text: 'Hello, World!' }],
    },
  ]);
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );
  const searchParams = useSearchParams();
  const pageId = searchParams.get('pageId');
  const pageType = searchParams.get('pageType');
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const pageDisplayURL = pageName;
  const { submitPageContent, refetchDynamicPage, isCreatePageContentSuccess } =
    usePageContent({
      pageDisplayURL,
    });

  const form = useForm({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageContentName: '',
      pageContentDisplayURL: '',
      pageContentDisplayImage: undefined,
      pageContentResource: undefined,
      isPageContentHidden: false,
      editorContent: plateEditor,
    },
  });

  const onSubmit = async (data: any) => {
    let pageContent: IPageContentItem = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      pageContentResource: data.pageContentResource,
      isPageContentHidden: data.isPageContentHidden,
      pageContentDisplayURL: data.pageContentDisplayURL,
      editorContent: plateEditor,
      pageId: pageId as string,
      pageName: pageName,
      pageType: pageType ? pageType : '',
      href: `${pageName}/${data.pageContentDisplayURL}`,
      userId: (uiId && uiId) as string,
    };

    console.log(data, 'pageContent');

    await submitPageContent(pageContent, refetchDynamicPage);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'pageContentName' && !isManualEdit) {
        const pageNameValue = value?.pageContentName || '';
        form.setValue('pageContentDisplayURL', toKebabCase2(pageNameValue), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isManualEdit]);

  const handlePageDisplayUrlChange = (e) => {
    setIsManualEdit(true);
    form.setValue('pageContentDisplayURL', e.target.value);
  };

  return (
    <PageLayout title="Create Page Content">
      <div
        className={`flex flex-col mt-10 min-h-screen w-full ${pageContentPaddingStyles}`}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className={`space-y-6 mb-10 min-h-screen }`}>
              {canEdit && (
                <>
                  <FormField
                    control={form.control}
                    name="pageContentName"
                    label="Content Name"
                    placeholder=""
                  />

                  <FormField
                    control={form.control}
                    name="pageContentDisplayURL"
                    label="Display URL"
                    placeholder=""
                    type="text"
                    onBlur={handlePageDisplayUrlChange}
                  />
                  <FormField
                    control={form.control}
                    name="pageContentDisplayImage"
                    label="Display Image"
                    placeholder=""
                    type="picture"
                  />

                  {pageType == EPageType.ResList && (
                    <FormField
                      control={form.control}
                      name="pageContentResource"
                      label="Display Document"
                      placeholder=""
                      type="document"
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="isPageContentHidden"
                    label=""
                    placeholder="Hide this Content"
                    type="checkbox"
                  />
                  {pageType != EPageType.ResList && (
                    <PlateEditor
                      key={plateEditorKey}
                      value={plateEditor}
                      onChange={(value) => {
                        setPlateEditor(value);
                      }}
                    />
                  )}
                </>
              )}
            </div>
            {canEdit && (
              <div
                className={`w-full sticky bg-white flex mx-auto bottom-0 z-40 h-20 shadow2xl`}
              >
                <LoadingButton className="" buttonText="Post" loading={false} />
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </PageLayout>
  );
};

const EditPageContent = () => {
  const router = useRouter();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const uiId = uiActiveUser.uiId;
  const [contentData, setContentData] = useState<IPageContentMain>();
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const pageContentName = page[2];
  const [isManualEdit, setIsManualEdit] = useState(false);
  const { submitEditedPageContent, isEditPageContentSuccess } =
    usePageContent();
  const {
    data: pageContentData,
    isError: hasPageContentFetchError,
    isSuccess: isPageContentFetchSuccess,
    isLoading: isPageContentFetchLoading,
    error: pageContentFetchError,
    refetch: pageContentFetchRefetch,
  } = useGetPageContentQuery({
    PC_DisplayURL: pageContentName,
    PG_DisplayURL: pageName,
  } as IPageContentGetRequest);

  const [plateEditor, setPlateEditor] = useState<TElement[]>([
    {
      id: '1',
      type: 'p',
      children: [{ text: 'Hello, World!' }],
    },
  ]);
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );
  const { notify } = useNotification();
  const [originalData, setOriginalData] = useState<IPageContentMain>();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('pageId');
  const [pageType, setPageType] = useState<string>('');

  useEffect(() => {
    if (pageContentData && pageContentData.data.PG_PageContent) {
      const page = pageContentData.data;
      const pageContent = page.PG_PageContent;
      if (pageContent) {
        const normalizedPage = pageNormalizer(page, pageContent);
        setPageType(normalizedPage.pageType);
        setContentData(normalizedPage.pageContent);
        setOriginalData(normalizedPage.pageContent);

        setPlateEditor(
          normalizedPage.pageContent?.editorContent || plateEditor
        );

        setPlateEditorKey(
          JSON.stringify(
            normalizedPage.pageContent?.editorContent || plateEditor
          )
        );
      }
    }
  }, [pageContentData]);

  const form = useForm({
    resolver: zodResolver(pageContentSchemaEdit),
    defaultValues: {
      pageContentName: '',
      pageContentResource: undefined,
      pageContentDisplayImage: undefined,
      pageContentDisplayURL: '',
      isPageContentHidden: false,
      // editorContent: plateEditor,
    },
  });

  const handlePageDisplayUrlChange = (e) => {
    setIsManualEdit(true);
    form.setValue('pageContentDisplayURL', e.target.value);
  };

  useEffect(() => {
    if (isPageContentFetchSuccess && contentData) {
      console.log(contentData, 'pageContentDisplayURL');
      form.reset(contentData);
      setPlateEditor(contentData.editorContent || plateEditor);
      setPlateEditorKey(
        JSON.stringify(contentData.editorContent || plateEditor)
      );
    }
  }, [isPageContentFetchSuccess, contentData, form]);

  const onSubmit = async (data: any) => {
    const newDataWithContents = { ...data, editorContent: plateEditor };
    const changedFields = getChangedFields(originalData, newDataWithContents);
    if (pageType == EPageType.ResList && changedFields) {
      if (changedFields.editorContent) {
        delete changedFields['editorContent'];
      }
    }
    const pageContentId: string = contentData!.pageContentId!;
    if (Object.keys(changedFields).length > 0) {
      await submitEditedPageContent(
        contentData?.pageDisplayURL as string,
        pageType,
        data.pageContentDisplayURL,
        pageContentId,
        changedFields as Partial<IPageContentItem>,
        pageContentFetchRefetch
      );
    } else {
      notifyNoChangesMade(notify);
    }
  };

  // useEffect(() => {
  //   handleRoutingOnError(
  //     router,
  //     hasPageContentFetchError,
  //     pageContentFetchError
  //   );
  // }, [hasPageContentFetchError, pageContentFetchError, router]);

  if (isPageContentFetchLoading) {
    return <AppLoading />;
  }

  return (
    <>
      {isPageContentFetchSuccess && originalData && (
        <PageListLayout pageContent={originalData}>
          <div
            className={`flex flex-col min-h-screen w-full ${pageContentPaddingStyles}`}
          >
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={`space-y-6 mb-10 min-h-screen `}>
                  <>
                    {canEdit && (
                      <>
                        <FormField
                          control={form.control}
                          name="pageContentName"
                          label="Content Name"
                          placeholder=""
                        />
                        <FormField
                          control={form.control}
                          name="pageContentDisplayURL"
                          label="Display URL"
                          placeholder=""
                          type="text"
                          onBlur={handlePageDisplayUrlChange}
                        />
                        <FormField
                          control={form.control}
                          name="pageContentDisplayImage"
                          label="Display Image"
                          placeholder=""
                          type="picture"
                        />

                        {pageType == EPageType.ResList && (
                          <FormField
                            control={form.control}
                            name="pageContentResource"
                            label="Display Document"
                            placeholder=""
                            type="document"
                          />
                        )}
                        <FormField
                          control={form.control}
                          name="isPageContentHidden"
                          label=""
                          placeholder="Hide this Content"
                          type="checkbox"
                        />
                      </>
                    )}

                    {pageType != EPageType.ResList && (
                      <PlateEditor
                        key={plateEditorKey}
                        value={plateEditor}
                        onChange={(value) => {
                          setPlateEditor(value);
                        }}
                      />
                    )}
                  </>
                </div>
                {canEdit && (
                  <div
                    className={`w-full sticky bg-white flex mx-auto bottom-0 z-40 h-20 shadow2xl`}
                  >
                    <LoadingButton
                      className=""
                      buttonText="Save Changes"
                      loading={false}
                    />
                  </div>
                )}
              </form>
            </FormProvider>
          </div>
        </PageListLayout>
      )}
    </>
  );
};

const PageList = () => {
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageContentName = page[2];

  if (pageContentName === 'create-page-content') {
    return <CreatePageContent />;
  } else {
    return <EditPageContent />;
  }
};

export default PageList;
