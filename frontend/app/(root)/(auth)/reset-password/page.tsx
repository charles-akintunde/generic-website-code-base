import dynamic from 'next/dynamic';
import React from 'react';
const ResetPasswordWithEmailForm = dynamic(
  () =>
    import('../../../../components/common/form/passoword-reset-form').then(
      (mod) => mod.ResetPasswordWithEmailFormComponent
    ),
  {
    ssr: false,
  }
);

export default function ResetPassword() {
  return (
    <div>
      {typeof window !== 'undefined' ? (
        <ResetPasswordWithEmailForm />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
