'use-client';
import React from 'react';
import { Button, Result } from 'antd';
import { Mouse } from 'lucide-react';
import { HomeOutlined } from '@ant-design/icons';
import AppButton from '../../../../../components/common/button/app-button';
import { primarySolidButtonStyles } from '../../../../../styles/globals';

interface AccessDeniedProps {
  currentUserRole: string;
  pagePermission: string[];
}

const InternalServerError: React.FC<AccessDeniedProps> = ({}) => {
  //   const router = useRouter();

  return (
    <div className="min-h-screen">
      <Result
        status="500"
        title="Internal Server Error"
        subTitle="Sorry, something went wrong on server."
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

export default InternalServerError;
