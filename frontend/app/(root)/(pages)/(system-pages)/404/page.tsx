'use-client';
import React from 'react';
import { Button, Result } from 'antd';
import AppButton from '@/components/common/button/app-button';
import { Mouse } from 'lucide-react';
import { primarySolidButtonStyles } from '@/styles/globals';
import { HomeOutlined } from '@ant-design/icons';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-pg">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
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

export default NotFoundPage;
