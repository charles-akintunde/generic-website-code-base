'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../../ui/form';
import { useState } from 'react';
import {
  passwordResetSchema,
  resetPasswordWithEmailSchema,
} from '../../../utils/formSchema';
import FormField from '../form-field';
import LoadingButton from '../button/loading-button';
import AppRequestResult from '../app-request-result';
import { useUserInfo } from '../../../hooks/api-hooks/use-user-info';

interface PasswordResetFormProps {
  token: string;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ token }) => {
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token: token,
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const { submitPasswordResetWithToken } = useUserInfo();

  // const errors = form.formState.errors;

  // // Log form errors in real-time
  // useEffect(() => {
  //   if (Object.keys(errors).length > 0) {
  //     console.log('Form errors:', errors);
  //   }
  // }, [errors]);

  const onSubmit = async (data: any) => {
    await submitPasswordResetWithToken(data);
  };
  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-bold mb-3 text-md text-gray-800">Reset Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            label="New Password"
            placeholder=""
            type="password"
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            label="Confirm New Password"
            placeholder=""
            type="password"
          />
          <LoadingButton
            buttonText="Reset Password"
            loading={loading}
            type="submit"
          />
        </form>
      </Form>
    </div>
  );
};

const ResetPasswordWithEmailForm = () => {
  const form = useForm<z.infer<typeof resetPasswordWithEmailSchema>>({
    resolver: zodResolver(resetPasswordWithEmailSchema),
    defaultValues: {
      email: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const {
    submitEmailForPasswordReset,
    isResetPasswordWithSuccess,
    resetPasswordSuccessMessage,
  } = useUserInfo();

  const onSubmit = async (data: any) => {
    await submitEmailForPasswordReset(data.email);
  };

  if (isResetPasswordWithSuccess) {
    return (
      <AppRequestResult
        status={'success'}
        title="Success"
        subTitle={resetPasswordSuccessMessage}
      />
    );
  }
  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-bold mb-3 text-md text-gray-800">Reset Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="user@genericapp.com"
          />

          <LoadingButton
            buttonText="Reset Password"
            loading={loading}
            type="submit"
          />
        </form>
      </Form>
    </div>
  );
};

const ResetPasswordWithEmailFormComponent = () => {
  return <ResetPasswordWithEmailForm />;
};

export { ResetPasswordWithEmailFormComponent, PasswordResetForm };
