'use client';
import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { userProfileSchema, userRoleStatusSchema } from '@/utils/formSchema';
import FormField from '../form-field';
import { getNames } from 'country-list';
import LoadingButton from '../button/loading-button';
import { IUserBase, IUserInfo } from '@/types/componentInterfaces';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { EditOutlined } from '@ant-design/icons';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  getChangedFields,
  MEMBERPOSITION_OPTIONS,
  notifyNoChangesMade,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from '@/utils/helper';
import { useNotification } from '@/components/hoc/notification-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/plate-ui/button';
import { sanitizeAndCompare } from '@/app/(root)/(pages)/(system-pages)/user-profile/[user-profile-id]/page';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { toggleCreateUserDialog } from '@/store/slice/userSlice';
import { Tooltip } from 'antd';
import { EMemberPosition, EUserRole } from '@/types/enums';

interface UserProfileFormProps {
  userInfo: IUserInfo;
  userProfileRefetch: () => {};
  setDialogOpen?: (open: boolean) => void;
}

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userInfo,
  userProfileRefetch,
  setDialogOpen,
}) => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiId = uiActiveUser.uiId;
  const countries = getNames();
  const { notify } = useNotification();
  const { submitEditUser } = useUserInfo();
  const [isSameUser, setIsSameUser] = useState(
    sanitizeAndCompare(uiId as string, userInfo?.id as string)
  );
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userInfo || {
      uiFirstName: '',
      uiLastName: '',
      uiPhoto: '',
      uiCity: '',
      uiProvince: '',
      uiCountry: '',
      uiPostalCode: '',
      uiPhoneNumber: '',
      uiOrganization: '',
      uiAbout: '',
    },
  });

  useEffect(() => {
    if (userInfo) {
      form.reset(userInfo);
    }
  }, [userInfo, form]);

  const onSubmit = async (
    data: IUserInfo,
    event: { preventDefault: () => void }
  ) => {
    event.preventDefault();
    const changedFields = getChangedFields(userInfo, data);
    if (Object.keys(changedFields).length > 0) {
      console.log(changedFields, 'changedFields');
      await submitEditUser(userInfo.id, changedFields, userProfileRefetch);
      setDialogOpen(false);
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  return (
    <Form {...form}>
      <div className="max-h-[calc(60vh-80px)] ">
        <form
          className="space-y-6 w-full h-full overflow-y-auto pb-20"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {isSameUser && (
            <>
              <FormField
                control={form.control}
                name="uiFirstName"
                label="First Name"
                placeholder="Your First Name"
              />
              <FormField
                control={form.control}
                name="uiLastName"
                label="Last Name"
                placeholder="Your Last Name"
              />
              <FormField
                control={form.control}
                name="uiCountry"
                label="Country"
                placeholder="Select Your Country"
                type="select"
                options={countries.map((country: string) => ({
                  value: country,
                  label: country,
                }))}
              />
              <FormField
                control={form.control}
                name="uiCity"
                label="City"
                placeholder="Your City"
              />
              <FormField
                control={form.control}
                name="uiProvince"
                label="Province"
                placeholder="Your Province"
              />
              <FormField
                control={form.control}
                name="uiPostalCode"
                label="Postal Code"
                placeholder="Your Postal Code"
              />
              <FormField
                control={form.control}
                name="uiPhoneNumber"
                label="Phone Number"
                placeholder="Your Phone Number"
              />
              <FormField
                control={form.control}
                name="uiOrganization"
                label="Organization"
                placeholder="Your Organization"
              />
              <FormField
                type="picture"
                control={form.control}
                name="uiPhoto"
                label="Profile Picture"
                placeholder="Your Status"
              />
              <FormField
                type="textarea"
                control={form.control}
                name="uiAbout"
                label="About"
                placeholder="Enter a short description about you."
              />
            </>
          )}
        </form>
      </div>

      <div className="fixed z-30 mt-20 bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
        <LoadingButton loading={false} buttonText={'Save changes'} />
      </div>
    </Form>
  );
};

export const UserProfileDialog: React.FC<UserProfileFormProps> = ({
  userInfo,
  userProfileRefetch,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon">
          <EditOutlined className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to the profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 ">
          <ScrollArea className="max-h-[70vh] rounded-md border p-4">
            <UserProfileForm
              userProfileRefetch={userProfileRefetch}
              userInfo={userInfo}
              setDialogOpen={setDialogOpen}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type UserRoleStatusFormData = z.infer<typeof userRoleStatusSchema>;

export const UserRoleStatusDialog = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiId = uiActiveUser.uiId;
  const { submitEditRoleStatus } = useUserInfo();
  const dispatch = useAppDispatch();
  const isDialogOpen = useAppSelector((state) => state.userSlice.isDialogOpen);
  const userInfo = useAppSelector((state) => state.userSlice.editingUser);
  const uiIsSuperAdmin = uiActiveUser.uiIsSuperAdmin;
  const [isSameUser, setIsSameUser] = useState(
    sanitizeAndCompare(uiId as string, userInfo?.id as string)
  );
  const { notify } = useNotification();

  const form = useForm<UserRoleStatusFormData>({
    resolver: zodResolver(userRoleStatusSchema),
    defaultValues: userInfo || {
      uiRole: '',
      uiStatus: '',
      // uiMemberPosition
    },
  });

  console.log(userInfo, 'userInfo');
  useEffect(() => {
    if (userInfo) {
      form.reset(userInfo);
    }
  }, [userInfo, form]);

  const onSubmit = async (
    data: IUserBase,
    event: { preventDefault: () => void }
  ) => {
    event.preventDefault();
    const changedFields = getChangedFields(userInfo, data);
    if (userInfo && Object.keys(changedFields).length > 0) {
      await submitEditRoleStatus(userInfo.id, changedFields);
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  const { watch } = form;
  const uiRole = watch('uiRole');

  const handleOpenChange = () => {
    dispatch(toggleCreateUserDialog());
  };

  if (!uiIsSuperAdmin) {
    return <></>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="py-4 ">
          <Form {...form}>
            <form
              className="space-y-6 w-full h-full overflow-y-auto pb-20"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!isSameUser && (
                <>
                  <FormField
                    control={form.control}
                    name="uiStatus"
                    label="Status"
                    placeholder="User Status"
                    type="select"
                    options={STATUS_OPTIONS}
                  />
                  <FormField
                    control={form.control}
                    name="uiRole"
                    label="Role"
                    placeholder="User Role"
                    type="select"
                    options={ROLE_OPTIONS}
                  />
                  {(uiRole == EUserRole.SuperAdmin ||
                    uiRole == EUserRole.Admin ||
                    uiRole == EUserRole.Member) && (
                    <FormField
                      control={form.control}
                      name="uiMemberPosition"
                      label="Member Position"
                      placeholder="Select Member Position"
                      type="select"
                      options={MEMBERPOSITION_OPTIONS}
                    />
                  )}

                  <div className="fixed z-30 mt-20 bottom-0 left-0 right-0 bg-white p-4  flex justify-center">
                    <LoadingButton
                      loading={false}
                      buttonText={'Save changes'}
                    />
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
