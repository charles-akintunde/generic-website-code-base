'use client';
import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userProfileSchema } from '@/utils/formSchema';
import FormField from '../form-field';
import { getNames } from 'country-list';
import { UserRound } from 'lucide-react';
import { EditOutlined } from '@ant-design/icons';
//import AppButton from '../button/app-button';
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
import { Button } from '@/components/ui/button';
import { primarySolidButtonStyles } from '@/styles/globals';
import { IUserInfo } from '@/types/componentInterfaces';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { getChangedFields } from '@/utils/helper';

interface UserProfileFormProps {
  userInfo: IUserInfo;
  userProfileRefetch: () => {};
}

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userInfo,
  userProfileRefetch,
}) => {
  console.log(userInfo, 'userInfo');
  const countries = getNames();
  const { handleEditUser } = useUserInfo();
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: (userInfo && userInfo) || {
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
    },
  });

  useEffect(() => {
    if (userInfo) {
      form.reset(userInfo);
    }
  }, [userInfo, form]);

  const onSubmit = async (data: IUserInfo, event) => {
    console.log(data, 'DATA');
    event.preventDefault();
    const changedFields = getChangedFields(userInfo, data);
    console.log(changedFields, 'changedFields');
    await handleEditUser(userInfo.id, data, userProfileRefetch);
  };

  return (
    <Form {...form}>
      <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
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
          control={form.control}
          name="uiRole"
          label="Role"
          placeholder="Your Role"
        />
        <FormField
          control={form.control}
          name="uiStatus"
          label="Status"
          placeholder="Your Status"
        />
        <FormField
          control={form.control}
          name="uiStatus"
          label="Status"
          placeholder="Your Status"
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
          placeholder="Enter a short descrption about you."
        />
        <div className="flex items-center  sticky bg-white h-20 bottom-0">
          <LoadingButton loading={false} buttonText={'Save changes'} />
        </div>
      </form>
    </Form>
  );
};

export default UserProfileForm;
