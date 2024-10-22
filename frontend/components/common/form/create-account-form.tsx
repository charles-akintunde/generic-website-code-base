'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import FormField from '../form-field';
import { Form } from '../../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountCreationSchema } from '../../../utils/formSchema';
import LoadingButton from '../button/loading-button';
import Link from 'next/link';
import { useCreateAccount } from '../../../hooks/api-hooks/use-create-account';
import { ICreatAccount } from '../../../types/componentInterfaces';
import AppRequestResult from '../app-request-result';
import TermsAndService from '../dialog/terms-and-service-dialog';

const CreateAccountForm = () => {
  const { submitCreateAccount, isLoading, isError, isSuccess, successMessage } =
    useCreateAccount();
  const form = useForm<z.infer<typeof accountCreationSchema>>({
    resolver: zodResolver(accountCreationSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async (data: ICreatAccount) => {
    await submitCreateAccount(data);
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  if (isSuccess) {
    return (
      <AppRequestResult
        status="success"
        title="Success"
        subTitle={successMessage}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-bold mb-3 text-md  text-gray-800">Create Account</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-4">
            <FormField
              control={form.control}
              name="firstname"
              label="First Name"
              placeholder=""
            />
            <FormField
              control={form.control}
              name="lastname"
              label="Last Name"
              placeholder=""
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder=""
          />
          {/* <div className="flex justify-center space-x-4"> */}
          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder=""
            type="password"
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder=""
            type="password"
          />
          {/* </div> */}

          <LoadingButton
            buttonText="Create Account"
            loading={isLoading}
            type="submit"
          />
        </form>
      </Form>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" legacyBehavior passHref>
            <a className="text-blue-500 font-medium hover:underline">Sign In</a>
          </Link>
        </p>
        <p className="text-gray-500 text-sm mt-2">
          By clicking you agree to our <TermsAndService />
        </p>
      </div>
    </div>
  );
};

export default CreateAccountForm;
