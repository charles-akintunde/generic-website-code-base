'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../../ui/form';
import { useEffect } from 'react';
import { loginSchema } from '../../../utils/formSchema';
import FormField from '../form-field';
import Link from 'next/link';
import LoadingButton from '../button/loading-button';
import useUserLogin from '../../../hooks/api-hooks/use-user-login';
import { IUserLogin } from '../../../types/componentInterfaces';
import TermsAndService from '../dialog/terms-and-service-dialog';

function LoginForm() {
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
      // form.reset();
    }
  }, [isSuccess, form]);

  const onSubmit = async (userLoginData: IUserLogin) => {
    await sendLoginRequest(userLoginData);
  };

  return (
    <>
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg text-center font-bold  text-gray-800">Login</h2>
      <div className='text-center text-sm'>
        <p className=''>
          Don't have an account? {' '}
        <Link href="/sign-up" legacyBehavior passHref>
   <a className="text-primary text-sm font-medium hover:underline">
     Create Account
   </a>
 </Link>
        </p>
   
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder=""
          />
          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder=""
            type="password"
          />
         
          <LoadingButton
            buttonText="Login"
            loading={isLoading}
            type="submit"
          />
        </form>
      </Form>
      <div className="mt-6">
      <p className="text-gray-500 text-center text-sm mt-2">
          By clicking you agree to our <TermsAndService />
        </p>
        <span className="text-gray-600 flex justify-around">
      
   <div className='text-sm mt-2'>
   <p className=''>
  Forgot Password? {' '}
<Link href="/reset-password" legacyBehavior passHref>
            <a className="text-primary text-sm font-medium hover:underline">
              Reset Password
            </a>
          </Link>
</p>
    </div>       

       
        </span>
     
      </div>
    </div>
  </>
  
  );
}

export default LoginForm;
