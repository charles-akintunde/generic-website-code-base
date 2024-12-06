'use client';
import React, { useEffect, useState } from 'react';
import { PlateEditor } from '../../plate/plate';
import FormField from '../form-field';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPageContentResourceSchema,
  pageContentResourceSchema,
  pageContentSchema,
  pageContentSchemaEdit,
} from '../../../utils/formSchema';
import LoadingButton from '../button/loading-button';
import usePageContent from '../../../hooks/api-hooks/use-page-content';
import {
  IPageContentItem,
  IPageContentMain,
} from '../../../types/componentInterfaces';
import { usePathname } from 'next/navigation';
import {
  getChangedFields,
  handleRoutingOnError,
  notifyNoChangesMade,
  pageNormalizer,
} from '../../../utils/helper';
import { IPageContentGetRequest } from '../../../types/requestInterfaces';
import { useSearchParams } from 'next/navigation';
import { useGetPageContentQuery } from '../../../api/pageContentApi';
import _ from 'lodash';
import { useNotification } from '../../hoc/notification-provider';
import {
  primarySolidButtonStyles,
  pageContentPaddingStyles,
} from '../../../styles/globals';
import { TElement } from '@udecode/plate-common';
import { EPageType } from '../../../types/enums';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { toKebabCase2 } from '../../../utils/helper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { FileDiff, PlusIcon } from 'lucide-react';
import { ScrollArea } from '../../ui/scroll-area';
import {
  setCurrentPage,
  setCurrentUserPage,
} from '../../../store/slice/pageSlice';

interface ICreatePageContentModal {
  pageType: string;
  pageId: string;
  onClick: () => void;
}

export const CreatePageContentModal = ({
  onClick,
}: ICreatePageContentModal) => {
  const dispatch = useAppDispatch();
  const currentUserPage = useAppSelector((state) => state.page.currentUserPage);
  const isModalOpen = currentUserPage?.isModalOpen;
  const isEditingMode = currentUserPage?.isEditingMode;

  const handleClose = () => {
    dispatch(
      setCurrentUserPage({
        isModalOpen: false,
        isEditingMode: false,
        pageContent: null,
      })
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <DialogTrigger asChild>
        <Button
          onClick={onClick}
          className={`${primarySolidButtonStyles} cursor-pointer`}
          asChild
        >
          <span>
            <PlusIcon className="mr-2 h-4 w-4" />
            {`Create Content`}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
      "
      >
        <DialogHeader>
          <DialogTitle>
            {`${isEditingMode ? 'Edit' : 'Create'} Resource`}
          </DialogTitle>
        </DialogHeader>
        
        <div className='m-4'>
        <CreatePageContentForm />
        </div>
     
        
      </DialogContent>
    </Dialog>
  );
};

export const CreatePageContentForm = ({}) => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const currentUserPage = useAppSelector((state) => state.page.currentUserPage);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const [isManualEdit, setIsManualEdit] = useState(false);
  const uiId = uiActiveUser.uiId;
  const dispatch = useAppDispatch();
  const existingPageContent = currentUserPage?.pageContent;
  const isEditingMode = currentUserPage?.isEditingMode;
  const [plateEditor, setPlateEditor] = useState<TElement[]>([
    {
      id: '1',
      type: 'p',
      children: [{ text: 'Hello, World!' }],
    },
  ]);

  //   const searchParams = useSearchParams();
  const pageId = currentUserPage?.pageId;
  const pageType = currentUserPage?.pageType;
  const pathname = usePathname();
  const page = pathname.split('/');
  const pageName = page[1];
  const pageDisplayURL = pageName;
  const {
    submitPageContent,
    submitEditedPageContent,
    isCreatePageContentSuccess,
    isEditPageContentLoading,
    isCreatePageContentLoading
  } = usePageContent({
    pageDisplayURL,
  });

  const form = useForm({
    resolver: zodResolver(createPageContentResourceSchema(isEditingMode as boolean)),
    defaultValues: existingPageContent || {
      pageContentName: '',
      pageContentResource: undefined,
      isPageContentHidden: false,
    },
  });

  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (data: any) => {
    let newpageContent = {
      pageContentName: data.pageContentName,
      pageContentDisplayImage: data.pageContentDisplayImage,
      pageContentResource: data.pageContentResource,
      isPageContentHidden: data.isPageContentHidden,
      pageContentDisplayURL: data.pageContentDisplayURL,
    };
    if (isEditingMode) {
      const changedFields = getChangedFields(
        existingPageContent,
        newpageContent
      );

      await submitEditedPageContent(
        pageName,
        pageType as string,
        '',
        existingPageContent?.pageContentId as string,
        changedFields as Partial<IPageContentItem>,
        () => ({})
      );
    } else {
      // @ts-ignore
      let pageContent: IPageContentItem = {
        pageContentName: data.pageContentName,
        // pageContentDisplayImage: data.pageContentDisplayImage,
        pageContentResource: data.pageContentResource,
        isPageContentHidden: data.isPageContentHidden,
        pageContentDisplayURL: data.pageContentDisplayURL,
        // editorContent: plateEditor,
        pageId: pageId as string,
        pageName: pageName,
        pageType: pageType ? pageType : '',
        // href: `${pageName}/${data.pageContentDisplayURL}`,
        userId: (uiId && uiId) as string,
      };
      await submitPageContent(pageContent);
    }
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

  const handlePageDisplayUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsManualEdit(true);
    form.setValue('pageContentDisplayURL', e.target.value);
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className={`space-y-6 mb-10 }`}>
            {canEdit && (
              <>
                <FormField
                  control={form.control}
                  name="pageContentName"
                  label="Content Name"
                  placeholder=""
                />

                {pageType != EPageType.ResList && (
                  <FormField
                    control={form.control}
                    name="pageContentDisplayURL"
                    label="Display URL"
                    placeholder=""
                    type="text"
                    onBlur={handlePageDisplayUrlChange}
                  />
                )}

                {/* {pageType == EPageType.ResList && (
                    <FormField
                      control={form.control}
                      name="pageContentDisplayURL"
                      label="Display URL"
                      placeholder=""
                      type="text"
                      onBlur={handlePageDisplayUrlChange}
                    />
                  )} */}

                {/* <FormField
                  control={form.control}
                  name="pageContentDisplayImage"
                  label="Display Image"
                  placeholder=""
                  type="picture"
                /> */}

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
                {/* {pageType != EPageType.ResList && (
                  <PlateEditor
                    key={plateEditorKey}
                    value={plateEditor}
                    onChange={(value) => {
                      setPlateEditor(value);
                    }}
                  />
                )} */}
              </>
            )}
            {canEdit && (
              <div className={``}>
                <LoadingButton
                  className=""
                  buttonText={`${isEditingMode ? 'Save Changes' : 'Post'}`}
                  loading={isEditingMode ?  isEditPageContentLoading : isCreatePageContentLoading}
                />
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export const EditPageContentForm = () => {
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

  const handlePageDisplayUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsManualEdit(true);
    form.setValue('pageContentDisplayURL', e.target.value);
  };

  useEffect(() => {
    if (isPageContentFetchSuccess && contentData) {
      form.reset(contentData as any);
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
  }, [hasPageContentFetchError, pageContentFetchError, router]);

  return (
    <>
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
    </>
  );
};
