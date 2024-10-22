import dynamic from 'next/dynamic';
import React from 'react';
const LoginForm = dynamic(
  () => import('../../../../components/common/form/login-form'),
  {
    ssr: false,
  }
);
const SignIn = () => {
  return (
    <>
      <LoginForm />
    </>
  );
};

export default SignIn;
