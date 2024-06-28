'use client';
import React, { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountCreationSchema, pageContentSchema } from '@/utils/formSchema';
import LoadingButton from '../common/button/loading-button';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import {
  IPageContentBase,
  IPageContentItem,
  IPageContentMain,
} from '@/types/componentInterfaces';
import { usePathname } from 'next/navigation';
import { fromKebabCase, toKebabCase } from '@/utils/helper';
import usePage from '@/hooks/api-hooks/use-page';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { IPageContentGetRequest } from '@/types/requestInterfaces';
import { Skeleton } from '../ui/skeleton';

const PageContent = () => {
  const { currentUser } = useUserLogin();
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const pageContentName = page[2];
  const { submitPageContent, editingPageContent } = usePageContent();
  const {
    currentPageContent,
    isPageContentFetchLoading,
    isPageContentFetchSuccess,
    hasPageContentFetchError,
  } =
    pageName &&
    pageContentName &&
    usePageContent({
      PC_Title: fromKebabCase(pageContentName),
      PG_Name: fromKebabCase(pageName),
    } as IPageContentGetRequest);
  const { currentPage } = usePage();
  const pageContentData = currentPageContent?.pageContents;

  console.log(pageContentData, 'pageContentData');
  if (isPageContentFetchLoading) {
    return (
      <PageLayout title="Loading Page Content...">
        <Skeleton className="h-[125px] w-[250px] rounded-xl min-h-screen" />
      </PageLayout>
    );
  }

  const form = useForm({
    resolver: zodResolver(pageContentSchema),
    defaultValues: pageContentData || {
      pageContentName: '',
      pageContentDisplayImage: undefined,
      isPageContentHidden: false,
      pageContents: [
        {
          id: '1',
          type: 'p',
          children: [{ text: 'Hello, World!' }],
        },
      ],
    },
  });

  const pageId = currentPage?.pageId ?? '';

  const onSubmit = async (data: IPageContentBase) => {
    console.log(data, 'DATA');
    let pageContent: IPageContentItem = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      isPageContentHidden: data.isPageContentHidden,
      pageContents: data.pageContents,
      pageId: pageId,
      pageName: pageName,
      href: `${toKebabCase(pageName)}/${toKebabCase(data.pageContentName)}`,
      userId: currentUser.Id,
    };
    console.log(pageContent, 'pageContent');
    await submitPageContent(pageContent);
  };

  if (isPageContentFetchSuccess) {
    return (
      <PageLayout title="Create Page Content">
        <div className="flex flex-col flex-grow mt-28 min-h-screen">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="space-y-6 min-h-screen relative bottom-20">
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
                <FormField
                  control={form.control}
                  name="pageContents"
                  label=""
                  placeholder=""
                  type="rich-text-editor"
                />
              </div>
              <div className="flex mt-4 w-full fixed justify-center items-center bottom-0 z-40 h-20 shadow2xl px-4">
                <LoadingButton
                  buttonText={`${editingPageContent ? 'Submit Edited' : 'Create'} Content`}
                  loading={false}
                />
              </div>
            </form>
          </Form>
        </div>
      </PageLayout>
    );
  }

  if (hasPageContentFetchError) {
    return (
      <PageLayout title="Error Loading Page Content">
        <div className="flex flex-col flex-grow mt-28 min-h-screen">
          <p>Error loading content. Please try again later.</p>
        </div>
      </PageLayout>
    );
  }

  return null;
};

export default PageContent;
