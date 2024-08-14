'use client';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '@/components/plate/plate';
import PageLayout from '@/components/page/layout';
import FormField from '@/components/common/form-field';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageContentSchema } from '@/utils/formSchema';
import LoadingButton from '@/components/common/button/loading-button';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import {
  IPageContentBase,
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import { usePathname } from 'next/navigation';
import {
  createPageContentItem,
  fromKebabCase,
  getChangedFields,
  notifyNoChangesMade,
  pageNormalizer,
  toKebabCase,
} from '@/utils/helper';

import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import { useGetPageContentQuery } from '@/api/pageContentApi';
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useNotification } from '@/components/hoc/notification-provider';
import { pageContentPaddingStyles } from '@/styles/globals';
import PageListLayout from './page-list-layout';
import { TElement } from '@udecode/plate-common';
import { EPageType } from '@/types/enums';
import AppLoading from '@/components/common/app-loading';
import { FloatButton } from 'antd';
import { useRouter } from 'next/navigation';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { useAppSelector } from '@/hooks/redux-hooks';

const CreatePageContent = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
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
  const { submitPageContent, isCreatePageContentSuccess } = usePageContent();

  const form = useForm({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageContentName: '',
      pageContentDisplayImage: undefined,
      pageContentResource: undefined,
      isPageContentHidden: false,
      editorContent: plateEditor,
    },
  });

  const onSubmit = async (data: IPageContentBase) => {
    let pageContent: IPageContentItem = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      pageContentResource: data.pageContentResource,
      isPageContentHidden: data.isPageContentHidden,
      editorContent: plateEditor,
      pageId: pageId as string,
      pageName: pageName,
      pageType: pageType ? pageType : '',
      href: `${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`,
      userId: (uiId && uiId) as string,
    };

    await submitPageContent(pageContent);
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
                <LoadingButton
                  className=""
                  buttonText="Edit Content"
                  loading={false}
                />
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
    PC_Title: fromKebabCase(pageContentName),
    PG_Name: fromKebabCase(pageName),
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
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageContentName: '',
      pageContentResource: undefined,
      pageContentDisplayImage: undefined,
      isPageContentHidden: false,
      // editorContent: plateEditor,
    },
  });

  useEffect(() => {
    if (isPageContentFetchSuccess && contentData) {
      form.reset(contentData);
      setPlateEditor(contentData.editorContent || plateEditor);
      setPlateEditorKey(
        JSON.stringify(contentData.editorContent || plateEditor)
      );
    }
  }, [isPageContentFetchSuccess, contentData, form]);

  const onSubmit = async (data: IPageContentBase) => {
    const pageContent = createPageContentItem(
      data,
      plateEditor,
      String(pageId),
      pageType,
      pageName,
      String(uiId && uiId),
      `${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`
    );
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
        pageName,
        pageType,
        data.pageContentName,
        pageContentId,
        changedFields as Partial<IPageContentItem>,
        pageContentFetchRefetch
      );
    } else {
      notifyNoChangesMade(notify);
    }
  };

  useEffect(() => {}, [
    hasPageContentFetchError,
    pageContentFetchError,
    router,
  ]);

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
                      buttonText="Edit Content"
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
