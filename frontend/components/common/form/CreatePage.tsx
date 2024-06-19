'use client';

import React, { useState } from 'react';
import { EPageType, EUserRole } from '@/types/enums';
import { Form } from '@/components/ui/form';
import FormField from '../FormField';
import { createPageSchema } from '@/utils/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LoadingButton from '../button/LoadingButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AppButton from '../button/AppButton';
import { primarySolidButtonStyles } from '@/styles/globals';
import { PlusIcon } from '@radix-ui/react-icons';
import { addPage } from '@/store/slice/pageSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import usePage from '@/hooks/api-hooks/usePage';

const CreatePage = ({ setIsOpen }) => {
  const { submitCreatedPage } = usePage();
  const form = useForm<z.infer<typeof createPageSchema>>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      pageName: '',
      pageType: EPageType.SinglePage,
      pagePermission: [],
      isHidden: false,
    },
  });

  const onSubmit = (data: z.infer<typeof createPageSchema>) => {
    if (false) {
      setIsOpen(false);
    }

    submitCreatedPage(data);

    console.log(data);
  };

  const OPTIONS = [
    { label: 'SuperAdmin', value: EUserRole.SuperAdmin },
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
            <FormField
              placeholder=""
              control={form.control}
              name="pageType"
              label="Page Type"
              type="select"
              options={[
                { value: EPageType.SinglePage, label: 'Single Page' },
                { value: EPageType.PageList, label: 'Multi Page' },
                { value: EPageType.ResList, label: 'Resource Page' },
              ]}
            />
            <FormField
              placeholder="Permissions.."
              control={form.control}
              name="pagePermission"
              label="Page Permission"
              type="multiple-select"
              options={OPTIONS}
              multiple={true} // Enable multiple selections
            />
            <FormField
              control={form.control}
              name="isHidden"
              label=""
              type="checkbox"
              placeholder="Hide this page"
            />
            <LoadingButton buttonText="Submit" loading={false} type="submit" />
          </form>
        </Form>
      </div>
    </div>
  );
};

export const CreatePageDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <h2 className="text-xl font-bold  text-gray-800">Create Page</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CreatePage setIsOpen={setIsOpen} />
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageDialog;
