'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import { passwordResetSchema } from '@/utils/formSchema';
import Logo from '../Logo';
import FormField from '../FormField';
import Link from 'next/link';
import LoadingButton from '../LoadingButton';

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
      <h2 className="text-xl font-bold mb-3  text-gray-800">Reset Password</h2>
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

export default PassowordResetForm;
