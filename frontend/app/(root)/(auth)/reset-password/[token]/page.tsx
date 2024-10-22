'use client';
import AppRequestResult from '../../../../../components/common/app-request-result';
import { PasswordResetForm } from '../../../../../components/common/form/passoword-reset-form';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const ConfirmUser = () => {
  const pathname = usePathname();
  const paths = pathname.split('/');

  if (paths.length != 3 || !paths[2]) {
    return (
      <AppRequestResult
        status="warning"
        title="Invalid URL"
        subTitle="The URL provided is invalid. Please check the link and try again."
        extra={<Link href="/reset-password">Go to Reset Password Page</Link>}
      />
    );
  }
  return <PasswordResetForm token={paths[2]} />;
};

export default ConfirmUser;
