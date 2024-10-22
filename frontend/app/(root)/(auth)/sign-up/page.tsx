import dynamic from 'next/dynamic';
import React from 'react';
const CreateAccountForm = dynamic(
  () => import('../../../../components/common/form/create-account-form'),
  {
    ssr: false,
  }
);

const SignUp = () => {
  return <CreateAccountForm />;
};

export default SignUp;
