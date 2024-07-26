'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { loginSchema } from '@/utils/formSchema';
import Logo from '../logo';
import FormField from '../form-field';
import Link from 'next/link';
import LoadingButton from '../button/loading-button';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { IUserLogin } from '@/types/componentInterfaces';

export function LoginForm() {
  const { sendLoginRequest, isSuccess, isLoading } = useUserLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  const onSubmit = async (userLoginData: IUserLogin) => {
    await sendLoginRequest(userLoginData);
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <h2 className="text-md font-bold mb-3  text-gray-800">Login</h2>
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
              name="password"
              label="Password"
              placeholder="******"
              type="password"
            />
            <LoadingButton
              buttonText="Login"
              loading={isLoading}
              type="submit"
            />
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don’t have an account yet?{' '}
            <Link href="/sign-up" legacyBehavior passHref>
              <a className="text-blue-500 font-medium hover:underline">
                Create Account
              </a>
            </Link>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            By clicking you agree to our{' '}
            <Link href="/terms-and-services" legacyBehavior passHref>
              <a className="text-blue-500 font-medium hover:underline">
                Terms and Services
              </a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
