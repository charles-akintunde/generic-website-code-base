'use client';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '../../plate/plate';
import PageLayout from '../layout';
import FormField from '../../common/form-field';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  pageContentSchema,
  pageContentSchemaEdit,
} from '../../../utils/formSchema';
import LoadingButton from '../../common/button/loading-button';
import usePageContent from '../../../hooks/api-hooks/use-page-content';
import {
  IOptionType,
  IPageContentItem,
  IPageContentMain,
  IUserBase,
  IUserList,
} from '../../../types/componentInterfaces';
import { usePathname } from 'next/navigation';
import {
  getChangedFields,
  handleRoutingOnError,
  mapToIIUserList,
  notifyNoChangesMade,
  pageNormalizer,
} from '../../../utils/helper';
import { IPageContentGetRequest } from '../../../types/requestInterfaces';
import { useSearchParams } from 'next/navigation';
import { useGetPageContentQuery } from '../../../api/pageContentApi';
import _ from 'lodash';
import { useNotification } from '../../hoc/notification-provider';
import { pageContentPaddingStyles } from '../../../styles/globals';
import PageListLayout from './page-list-layout';
import { TElement } from '@udecode/plate-common';
import { EPageType, EUserRole } from '../../../types/enums';
import AppLoading from '../../common/app-loading';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../hooks/redux-hooks';
import { toKebabCase2 } from '../../../utils/helper';
import { useGetUsersAssignedPositionsQuery } from '../../../api/userApi';

const CreatePageContent = () => {
  const [users, setUsers] = useState<IUserBase[]>();
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
  const { submitPageContent, isCreatePageContentSuccess } = usePageContent({
    pageDisplayURL,
  });
  const [OPTIONS, setOptions] = useState<any>(null);
  const {
    data: usersResponseData,
    isLoading: isUsersFetchLoading,
    refetch: refetchUsersList,
  } = useGetUsersAssignedPositionsQuery();

  const form = useForm({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageContentName: '',
      pageContentDisplayURL: '',
      pageContentCreatedAt: new Date(),
      pageContentDisplayImage: undefined,
      pageContentResource: undefined,
      isPageContentHidden: false,
      editorContent: plateEditor,
      pageContentUsersId: [],
    },
  });

  const onSubmit = async (data: any) => {
    // @ts-ignore
    let pageContent: IPageContentItem = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      pageContentResource: data.pageContentResource,
      pageContentCreatedAt: data.pageContentCreatedAt,
      isPageContentHidden: data.isPageContentHidden,
      pageContentDisplayURL: data.pageContentDisplayURL,
      pageContentUsersId: data.pageContentUsersId,
      editorContent: plateEditor,
      pageId: pageId as string,
      pageName: pageName,
      pageType: pageType ? pageType : '',
      href: `${pageName}/${data.pageContentDisplayURL}`,
      userId: (uiId && uiId) as string,
    };
    await submitPageContent(pageContent);
  };
  useEffect(() => {
    if (usersResponseData && usersResponseData.data) {
      const usersData: IUserList = mapToIIUserList(usersResponseData.data);

      if (usersData.users) {
        setUsers(usersData?.users);

        const options = usersData?.users?.map((user) => {
          return {
            label: `${user.uiFullName}`,
            value: user.id,
          };
        });
        setOptions(options);
      }
    }
  }, [usersResponseData]);

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

  const handlePageDisplayUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const trimmedValue = e.target.value.trim();
    setIsManualEdit(true);
    form.setValue('pageContentDisplayURL', trimmedValue);
  };

  if (isUsersFetchLoading) {
    return <AppLoading />;
  }

  return (
    <PageLayout title="Create Page Content">
      <div
        className={`flex flex-col mt-10 min-h-screen w-full ${pageContentPaddingStyles} shadow-md rounded-sm bg-white`}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className={`space-y-6 my-10 min-h-screen }`}>
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

                  {pageType == EPageType.ResList && (
                    <FormField
                      control={form.control}
                      name="pageContentDisplayURL"
                      label="Display URL"
                      placeholder=""
                      type="text"
                      onBlur={handlePageDisplayUrlChange}
                    />
                  )}

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

                  {pageType == EPageType.PageList && OPTIONS && (
                    <FormField
                      placeholder="Select page contents users"
                      control={form.control}
                      name="pageContentUsersId"
                      label="Page Content Users"
                      type="multiple-select"
                      options={OPTIONS}
                      multiple={true}
                    />
                  )}

                  {pageType == EPageType.PageList && (
                    <FormField
                      control={form.control}
                      name="pageContentCreatedAt"
                      label="Content Creation Date"
                      placeholder=""
                      type="datetime"
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
  const [users, setUsers] = useState<IUserBase[]>();
  const [OPTIONS, setOptions] = useState<any>(null);
  const {
    data: usersResponseData,
    isLoading: isUsersFetchLoading,
    refetch: refetchUsersList,
  } = useGetUsersAssignedPositionsQuery();

  useEffect(() => {
    if (usersResponseData && usersResponseData.data) {
      const usersData: IUserList = mapToIIUserList(usersResponseData.data);

      if (usersData.users) {
        setUsers(usersData?.users);

        const options = usersData?.users?.map((user) => {
          return {
            label: `${user.uiFullName}`,
            value: user.id,
          };
        });
        setOptions(options);
      }
    }
  }, [usersResponseData]);

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
      pageContentCreatedAt: '',
      pageContentUsersId: [],
      // editorContent: plateEditor,
    },
  });

  const handlePageDisplayUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsManualEdit(true);
    form.setValue('pageContentDisplayURL', e.target.value);
  };

  useEffect(() => {
    if (isPageContentFetchSuccess && contentData) {
      // @ts-ignore
      contentData.pageContentCreatedAt = new Date(
        contentData.pageContentCreatedAt as Date
      );

      contentData.pageContentUsersId =
        contentData.pageContenAssociatedUsers.map(
          (option: any) => option.value
        );
      // @ts-ignore
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

  useEffect(() => {
    handleRoutingOnError(
      router,
      hasPageContentFetchError,
      pageContentFetchError
    );
  }, [hasPageContentFetchError, pageContentFetchError, pathname]);

  if (isPageContentFetchLoading) {
    return <AppLoading />;
  }

  return (
    <>
      {isPageContentFetchSuccess && originalData ? (
        <PageListLayout pageContent={originalData}>
          <div className={`flex flex-col min-h-screen w-full `}>
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

                        {pageType == EPageType.PageList && OPTIONS && (
                          <FormField
                            placeholder="Select page contents users"
                            control={form.control}
                            name="pageContentUsersId"
                            label="Page Content Users"
                            type="multiple-select"
                            options={OPTIONS}
                            multiple={true}
                          />
                        )}

                        {pageType == EPageType.ResList && (
                          <FormField
                            control={form.control}
                            name="pageContentResource"
                            label="Display Document"
                            placeholder=""
                            type="document"
                          />
                        )}
                        {pageType == EPageType.PageList && (
                          <FormField
                            control={form.control}
                            name="pageContentCreatedAt"
                            label="Content Creation Date"
                            placeholder=""
                            type="datetime"
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
      ) : (
        <>
          <AppLoading />
        </>
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
