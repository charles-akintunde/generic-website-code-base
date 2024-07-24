'use client';
import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userProfileSchema } from '@/utils/formSchema';
import FormField from '../form-field';
import { getNames } from 'country-list';
import LoadingButton from '../button/loading-button';
import { IUserInfo } from '@/types/componentInterfaces';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { EditOutlined } from '@ant-design/icons';

import {
  getChangedFields,
  notifyNoChangesMade,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from '@/utils/helper';
import { useNotification } from '@/components/hoc/notification-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/plate-ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppButton from '../button/app-button';
import { primarySolidButtonStyles } from '@/styles/globals';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { sanitizeAndCompare } from '@/app/(root)/(pages)/(system-pages)/user-profile/[user-profile-id]/page';

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
  const { isAdmin, currentUser } = useUserLogin();
  const countries = getNames();
  const { notify } = useNotification();
  const { submitEditUser } = useUserInfo();
  const [isSameUser, setIsSameUser] = useState(
    sanitizeAndCompare(currentUser?.Id as string, userInfo?.id as string)
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
      uiRole: '',
      uiStatus: '',
      uiAbout: '',
    },
  });

  console.log(userInfo, 'userInfo');

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
      <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
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

        {isAdmin && !isSameUser && (
          <>
            <FormField
              control={form.control}
              name="uiRole"
              label="Role"
              placeholder="User Role"
              type="select"
              options={ROLE_OPTIONS}
            />
            <FormField
              control={form.control}
              name="uiStatus"
              label="Status"
              placeholder="User Status"
              type="select"
              options={STATUS_OPTIONS}
            />
          </>
        )}

        <div className="flex items-center sticky bg-white h-20 bottom-0">
          <LoadingButton loading={false} buttonText={'Save changes'} />
        </div>
      </form>
    </Form>
  );
};

const UserProfileDialog: React.FC<UserProfileFormProps> = ({
  userInfo,
  userProfileRefetch,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  // const handleSubmit = () => {
  //   // Logic for handling form submission
  //   // After submission, close the dialog
  //   setDialogOpen(false);
  // };
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <AppButton
          // isRightPosition={true}
          Icon={EditOutlined}
          buttonText={'Edit Profile'}
          classNames={`${primarySolidButtonStyles}`}
        />
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] w-full rounded-md border p-4">
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

export default UserProfileDialog;
