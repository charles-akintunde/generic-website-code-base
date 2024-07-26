'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import {
  passwordResetSchema,
  resetPasswordWithEmailSchema,
} from '@/utils/formSchema';
import Logo from '@/components/common/logo';
import FormField from '@/components/common/form-field';
import Link from 'next/link';
import LoadingButton from '@/components/common/button/loading-button';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import AppRequestResult from '../app-request-result';
import { Button } from '@/components/ui/button';

const PassowordResetForm = () => {
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // handle password change submission
    } finally {
      setLoading(false);
    }
  };
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
          <FormField
            control={form.control}
            name="newPassword"
            label="New Password"
            placeholder="******"
            type="password"
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="******"
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
    console.log(data, 'DATATATA');
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

export { ResetPasswordWithEmailForm, PassowordResetForm };
