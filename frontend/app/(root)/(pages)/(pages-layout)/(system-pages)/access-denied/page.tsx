'use-client';
import React from 'react';
import { Button, Result } from 'antd';
import { Mouse } from 'lucide-react';
import { HomeOutlined } from '@ant-design/icons';
import { primarySolidButtonStyles } from '../../../../../../styles/globals';
import AppButton from '../../../../../../components/common/button/app-button';

// interface AccessDeniedProps {
//   currentUserRole: string;
//   pagePermission: string[];
// }

const AccessDenied = () => {
  //   const router = useRouter();

  return (
    <div className="min-h-screen">
      <Result
        status="403"
        title="Unauthorized"
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
    </div>
  );
};

export default AccessDenied;
