'use client';

import React, { useEffect, useState } from 'react';
import { EPageType, EUserRole } from '../../../types/enums';
import { Form } from '../../ui/form';
import FormField from '../form-field';
import { createPageSchema } from '../../../utils/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LoadingButton from '../button/loading-button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import AppButton from '../button/app-button';
import { primarySolidButtonStyles } from '../../../styles/globals';
import { PlusIcon } from '@radix-ui/react-icons';
import { useAppSelector } from '../../../hooks/redux-hooks';
import usePage from '../../../hooks/api-hooks/use-page';
import { toKebabCase2 } from '../../../utils/helper';

const CreatePage = () => {
  const {
    submitCreatedPage,
    editingPage,
    submitEditedPage,
    isCreatePageLoading,
    isCreatePageSuccess,
    isEditPageSuccess,
    isEditPageLoading,
  } = usePage();
  const [isManualEdit, setIsManualEdit] = useState(false);
  const form = useForm<z.infer<typeof createPageSchema>>({
    resolver: zodResolver(createPageSchema),
    //@ts-ignore
    defaultValues: editingPage || {
      pageName: '',
      pageType: '',
      pageDisplayURL: '',
      pagePermission: [],
      isHidden: false,
    },
  });

  const onSubmit = (data: z.infer<typeof createPageSchema>) => {
    if (editingPage) {
      //@ts-ignore
      submitEditedPage(editingPage.pageId, data);
      if (isEditPageSuccess) {
        form.reset();
      }
    } else {
      //@ts-ignore
      submitCreatedPage(data);
      if (isCreatePageSuccess) {
        form.reset();
      }
    }

    // dispatch(toggleCreatePageDialog());
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'pageName' && !isManualEdit) {
        const pageNameValue = value?.pageName || '';
        form.setValue('pageDisplayURL', toKebabCase2(pageNameValue), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isManualEdit]);

  const OPTIONS = [
    { label: 'Super Admin', value: EUserRole.SuperAdmin },
    { label: 'Admin', value: EUserRole.Admin },
    { label: 'Member', value: EUserRole.Member },
    { label: 'User', value: EUserRole.User },
    { label: 'Public', value: EUserRole.Public },
    { label: 'Alumni', value: EUserRole.Alumni },
  ];
  //@ts-ignore
  const handlePageDisplayUrlChange = (e) => {
    setIsManualEdit(true);
    form.setValue('pageDisplayURL', e.target.value);
  };

  return (
    <div>
      <div className="max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pageName"
              label="Page Name"
              placeholder=""
              type="text"
            />
            <FormField
              control={form.control}
              name="pageDisplayURL"
              label="Display URL"
              placeholder=""
              type="text"
              onBlur={handlePageDisplayUrlChange}
            />
            {!editingPage && (
              <FormField
                placeholder="Page Type"
                control={form.control}
                name="pageType"
                label="Page Type"
                type="select"
                options={[
                  { value: EPageType.SinglePage, label: 'Single Page' },
                  { value: EPageType.PageList, label: 'Page List' },
                  { value: EPageType.ResList, label: 'Resource Page' },
                ]}
              />
            )}

            <FormField
              placeholder="Permissions.."
              control={form.control}
              name="pagePermission"
              label="Page Permission"
              type="multiple-select"
              options={OPTIONS}
              multiple={true}
            />
            <LoadingButton
              buttonText={`${editingPage ? 'Save Changes' : 'Post'}`}
              loading={editingPage ? isEditPageLoading : isCreatePageLoading}
              type="submit"
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export const CreatePageDialog = () => {
  const { editingPage, handleToggleCreateFormDialog } = usePage();
  const isDialogOpen = useAppSelector(
    (state) => state.page.isCreatePageDialogOpen
  );
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;

  if (!canEdit) {
    return <></>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleToggleCreateFormDialog}>
      <DialogTrigger asChild>
        <AppButton
          buttonText="Create Page"
          Icon={PlusIcon}
          classNames={primarySolidButtonStyles}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-bold  text-gray-800">
              {editingPage ? 'Edit' : 'Create'} Page
            </h2>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CreatePage />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageDialog;
