'use client';
import React from 'react';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userProfileSchema } from '@/utils/formSchema';
import FormField from '../form-field';
import { getNames } from 'country-list';
import AppButton from '../button/app-button';
import LoadingButton from '../button/loading-button';

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const UserProfileForm = () => {
  const countries = getNames();
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
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

  const onSubmit = async (data) => {};
  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
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
          options={countries.map((country) => ({
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
        <LoadingButton loading={true} buttonText={'Submit'} />
      </form>
    </Form>
  );
};

export default UserProfileForm;
