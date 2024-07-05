'use client';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '../plate/plate';
import PageLayout from '../page/layout';
import AppButton from '../common/button/app-button';
import {
  containerNoFlexPaddingStyles,
  glassmorphismSytles,
  primarySolidButtonStyles,
} from '@/styles/globals';
import { z } from 'zod';
import FormField from '@/components/common/form-field';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  accountCreationSchema,
  optionalImagePageContentSchema,
  pageContentSchema,
} from '@/utils/formSchema';
import LoadingButton from '../common/button/loading-button';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import {
  IPageContentBase,
  IPageContentItem,
  IPageContentMain,
} from '@/types/componentInterfaces';
import { usePathname } from 'next/navigation';
import {
  fromKebabCase,
  notifyNoChangesMade,
  toKebabCase,
} from '@/utils/helper';
import usePage from '@/hooks/api-hooks/use-page';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import { useGetPageContentQuery } from '@/api/pageContentApi';
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useNotification } from '../hoc/notification-provider';

const CreatePageContent = () => {
  const { currentUser } = useUserLogin();
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
  const router = useRouter();
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
    if (isCreatePageContentSuccess) {
      router.replace(
        `/${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`
      );
    }
  };

  return (
    <PageLayout title="Create Page Content">
      <div className={`flex flex-col flex-grow mt-28 min-h-screen`}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen relative bottom-20">
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
              <PlateEditor
                key={plateEditorKey}
                value={plateEditor}
                onChange={(value) => {
                  setPlateEditor(value);
                }}
              />
            </div>
            <div className="flex mt-4 w-full fixed justify-center items-center bottom-0 z-40 h-20 shadow2xl px-4 sm:px-6 lg:px-8">
              <LoadingButton buttonText="Create Content" loading={false} />
            </div>
          </form>
        </FormProvider>
      </div>
    </PageLayout>
  );
};

const EditPageContent = () => {
  const { currentUser } = useUserLogin();
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
  const [originalData, setOriginalData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('pageId');

  useEffect(() => {
    if (pageContentData && pageContentData.data.PG_PageContent) {
      const page = pageContentData.data;
      const pageContent = page.PG_PageContent;
      if (pageContent) {
        const normalizedPage: IPageMain = {
          pageId: page.PG_ID,
          pageName: page.PG_Name,
          pagePermission: page.PG_Permission.map(String),
          pageType: String(page.PG_Type),
          isHidden: false,
          href: `/${toKebabCase(page.PG_Name)}`,
          pageContents: {
            pageContentId: pageContent.PC_ID,
            pageName: page.PG_Name,
            pageId: pageContent.PG_ID,
            userId: pageContent.UI_ID,
            href: `${toKebabCase(page.PG_Name)}/${toKebabCase(pageContent.PC_Title)}`,
            pageContentName: pageContent.PC_Title,
            pageContentDisplayImage: pageContent.PC_ThumbImgURL as string,
            isPageContentHidden: pageContent.PC_IsHidden,
            pageContents: pageContent.PC_Content?.PC_Content,
          },
        };
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

  // useEffect(() => {
  //   if (hasPageContentFetchError) {
  //     router.replace('/404');
  //   }
  // }, [hasPageContentFetchError, router]);

  const getChangedFields = (
    originalData: IPageContentBase,
    newData: IPageContentBase
  ): Partial<IPageContentBase> => {
    return Object.keys(newData).reduce((acc, key) => {
      if (!_.isEqual(newData[key], originalData[key])) {
        acc[key] = newData[key];
      }
      return acc;
    }, {} as Partial<IPageContentBase>);
  };

  const onSubmit = async (data: IPageContentBase) => {
    const pageContent: IPageContentItem = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      isPageContentHidden: data.isPageContentHidden,
      pageContents: plateEditor,
      pageId: pageId as string,
      pageName: pageName,
      href: `${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`,
      userId: (currentUser && currentUser.Id) as string,
    };
    const newDataWithContents = { ...data, pageContents: plateEditor };
    const changedFields = getChangedFields(originalData, newDataWithContents);
    if (Object.keys(changedFields).length > 0) {
      console.log(changedFields, 'changedFields');
      await submitEditedPageContent(contentData.pageContentId, changedFields);
      if (isEditPageContentSuccess) {
        router.replace(
          `/${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`
        );
      }
    } else {
      notifyNoChangesMade(notify);
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
        <PageLayout
          title={
            contentData ? contentData.pageContentName : `Edit Page Content`
          }
          titleImgUrl={contentData && contentData.pageContentDisplayImage}
        >
          <div className={`flex flex-col flex-grow mt-28 min-h-screen`}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen relative bottom-20">
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
                  <PlateEditor
                    key={plateEditorKey}
                    value={plateEditor}
                    onChange={(value) => {
                      setPlateEditor(value);
                    }}
                  />
                </div>
                <div className="flex mt-4 w-full fixed justify-center items-center bottom-0 z-40 h-20 shadow2xl px-4 sm:px-6 lg:px-8">
                  <LoadingButton buttonText="Edit Content" loading={false} />
                </div>
              </form>
            </FormProvider>
          </div>
        </PageLayout>
      )}
    </>
  );
};

const PageContent = () => {
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageContentName = page[2];

  if (pageContentName === 'create-page-content') {
    return <CreatePageContent />;
  } else {
    return <EditPageContent />;
  }
};

export default PageContent;
