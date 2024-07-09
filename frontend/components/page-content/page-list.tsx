'use client';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '../plate/plate';
import PageLayout from '../page/layout';
import { z } from 'zod';
import FormField from '@/components/common/form-field';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageContentSchema } from '@/utils/formSchema';
import LoadingButton from '../common/button/loading-button';
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
import usePage from '@/hooks/api-hooks/use-page';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import { useGetPageContentQuery } from '@/api/pageContentApi';
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useNotification } from '../hoc/notification-provider';
import { pageContentPaddingStyles } from '@/styles/globals';
import PageListLayout from './page-list-layout';

const CreatePageContent = () => {
  const { currentUser, canEdit } = useUserLogin();
  const [plateEditor, setPlateEditor] = useState([
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
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const { submitPageContent, isCreatePageContentSuccess } = usePageContent();

  const form = useForm({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageContentName: '',
      pageContentDisplayImage: undefined,
      isPageContentHidden: false,
      pageContents: plateEditor,
    },
  });

  const onSubmit = async (data: IPageContentBase) => {
    let pageContent: IPageContentItem = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      isPageContentHidden: data.isPageContentHidden,
      pageContents: plateEditor,
      pageId: pageId as string,
      pageName: pageName,
      href: `${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`,
      userId: (currentUser && currentUser.Id) as string,
    };

    await submitPageContent(pageContent);
    console.log(isCreatePageContentSuccess, 'isCreatePageContentSuccess');
  };

  return (
    <PageLayout title="Create Page Content">
      <div className={`flex flex-col flex-grow mt-28 min-h-screen`}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen relative bottom-20">
              {canEdit && (
                <>
                  <FormField
                    control={form.control}
                    name="pageContentName"
                    label="Content Name"
                    placeholder="Content Name"
                  />
                  <FormField
                    control={form.control}
                    name="pageContentDisplayImage"
                    label="Display Image"
                    placeholder="Select display Image"
                    type="picture"
                  />
                  <FormField
                    control={form.control}
                    name="isPageContentHidden"
                    label=""
                    placeholder="Hide this Content"
                    type="checkbox"
                  />
                </>
              )}

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
                <LoadingButton buttonText="Create Content" loading={false} />
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </PageLayout>
  );
};

const EditPageContent = () => {
  const { currentUser, currentUserRole, canEdit } = useUserLogin();
  const [contentData, setContentData] = useState<IPageContentItem | null>(null);
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

  const [plateEditor, setPlateEditor] = useState([
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
  const [originalData, setOriginalData] = useState<IPageMain>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('pageId');

  useEffect(() => {
    if (pageContentData && pageContentData.data.PG_PageContent) {
      const page = pageContentData.data;
      const pageContent = page.PG_PageContent;
      if (pageContent) {
        const normalizedPage = pageNormalizer(page, pageContent);
        setContentData(normalizedPage.pageContents);
        setOriginalData(normalizedPage.pageContents);
        setPlateEditor(normalizedPage.pageContents.pageContents || plateEditor);
        setPlateEditorKey(
          JSON.stringify(
            normalizedPage.pageContents.pageContents || plateEditor
          )
        );
      }
    }
  }, [pageContentData]);

  const form = useForm({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageContentName: '',
      pageContentDisplayImage: undefined,
      isPageContentHidden: false,
      pageContents: plateEditor,
    },
  });

  useEffect(() => {
    if (isPageContentFetchSuccess && contentData) {
      form.reset(contentData);
      setPlateEditor(contentData.pageContents || plateEditor);
      setPlateEditorKey(
        JSON.stringify(contentData.pageContents || plateEditor)
      );
    }
  }, [isPageContentFetchSuccess, contentData, form]);

  const onSubmit = async (data: IPageContentBase) => {
    const pageContent = createPageContentItem(
      data,
      plateEditor,
      String(pageId),
      pageName,
      String(currentUser?.Id),
      `${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`
    );
    const newDataWithContents = { ...data, pageContents: plateEditor };
    const changedFields = getChangedFields(originalData, newDataWithContents);
    if (Object.keys(changedFields).length > 0) {
      console.log(changedFields, 'changedFields');
      await submitEditedPageContent(
        pageName,
        data.pageContentName,
        contentData.pageContentId,
        changedFields,
        pageContentFetchRefetch
      );
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  if (isPageContentFetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-pg">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} />
      </div>
    );
  }

  return (
    <>
      {isPageContentFetchSuccess && (
        // <PageLayout
        //   title={
        //     contentData ? contentData.pageContentName : `Edit Page Content`
        //   }
        //   titleImgUrl={String(
        //     contentData && contentData.pageContentDisplayImage
        //   )}
        // >
        <PageListLayout page={originalData}>
          <div className={`flex flex-col flex-grow mt-28 min-h-screen`}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className={` space-y-6 min-h-screen relative bottom-20`}>
                  {canEdit && (
                    <>
                      <FormField
                        control={form.control}
                        name="pageContentName"
                        label="Content Name"
                        placeholder="Content Name"
                      />
                      <FormField
                        control={form.control}
                        name="pageContentDisplayImage"
                        label="Change Display Image"
                        placeholder="Select display Image"
                        type="picture"
                      />
                      <FormField
                        control={form.control}
                        name="isPageContentHidden"
                        label=""
                        placeholder="Hide this Content"
                        type="checkbox"
                      />
                    </>
                  )}

                  <PlateEditor
                    key={plateEditorKey}
                    value={plateEditor}
                    onChange={(value) => {
                      setPlateEditor(value);
                    }}
                  />
                </div>
                <div
                  className={`flex mt-4 w-full fixed justify-center items-center bottom-0 z-40 h-20 shadow2xl ${pageContentPaddingStyles}`}
                >
                  {canEdit && (
                    <LoadingButton buttonText="Edit Content" loading={false} />
                  )}
                </div>
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
