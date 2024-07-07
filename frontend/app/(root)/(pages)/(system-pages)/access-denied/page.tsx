'use-client';
import React from 'react';
import { Button, Result } from 'antd';
import AppButton from '@/components/common/button/app-button';
import { Mouse } from 'lucide-react';
import { primarySolidButtonStyles } from '@/styles/globals';
import { HomeOutlined } from '@ant-design/icons';

interface AccessDeniedProps {
  currentUserRole: string;
  pagePermission: string[];
}

const AccessDenied: React.FC<AccessDeniedProps> = ({}) => {
  //   const router = useRouter();

  return (
    <Result
      status="403"
      title="403 Forbidden"
      subTitle="You do not have permission to access this page."
      extra={
        <AppButton
          Icon={HomeOutlined}
          href={'/'}
          buttonText={'Go Home'}
          classNames={`w-auto ${primarySolidButtonStyles}`}
        />
      }
    />
  );
};

export default AccessDenied;
