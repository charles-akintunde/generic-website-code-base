'use client';

import React, { useState } from 'react';
import { EPageType, EUserRole } from '@/types/enums';
import { Form } from '@/components/ui/form';
import FormField from '../form-field';
import { createPageSchema } from '@/utils/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LoadingButton from '../button/loading-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AppButton from '../button/app-button';
import { primarySolidButtonStyles } from '@/styles/globals';
import { PlusIcon } from '@radix-ui/react-icons';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import usePage from '@/hooks/api-hooks/use-page';

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
  const form = useForm<z.infer<typeof createPageSchema>>({
    resolver: zodResolver(createPageSchema),
    defaultValues: editingPage || {
      pageName: '',
      pageType: '',
      pagePermission: [],
      isHidden: false,
    },
  });

  const onSubmit = (data: z.infer<typeof createPageSchema>) => {
    if (editingPage) {
      submitEditedPage(editingPage.pageId, data);
      if (isEditPageSuccess) {
        form.reset();
      }
    } else {
      submitCreatedPage(data);
      if (isCreatePageSuccess) {
        form.reset();
      }
    }

    // dispatch(toggleCreatePageDialog());
  };

  const OPTIONS = [
    { label: 'Super Admin', value: EUserRole.SuperAdmin },
    { label: 'Admin', value: EUserRole.Admin },
    { label: 'Member', value: EUserRole.Member },
    { label: 'User', value: EUserRole.User },
    { label: 'Public', value: EUserRole.Public },
  ];

  return (
    <div>
      <div className="max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pageName"
              label="Page Name"
              placeholder="Events"
              type="text"
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
              multiple={true} // Enable multiple selections
            />
            {/* <FormField
              control={form.control}
              name="isHidden"
              label=""
              type="checkbox"
              placeholder="Hide this page"
            /> */}
            <LoadingButton
              buttonText="Submit"
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
  const dispatch = useAppDispatch();
  const {
    submitCreatedPage,
    pages,
    editingPage,
    handleToggleCreateFormDialog,
  } = usePage();
  const isDialogOpen = useAppSelector(
    (state) => state.page.isCreatePageDialogOpen
  );

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
            {' '}
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