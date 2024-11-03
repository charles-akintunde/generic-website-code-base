'use-client';
import React from 'react';
import { Result } from 'antd';

import { HomeOutlined } from '@ant-design/icons';
import AppButton from '../../../../../components/common/button/app-button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex flex-col items-center justify-center space-y-6 animate-fadeIn">
      <Result
        status="404"
        title={
          <h1 className="text-7xl font-extrabold text-blue-500 drop-shadow-lg">
            404
          </h1>
        }
        subTitle={
          <p className="text-lg text-gray-600 italic">
            Oops! The page you're looking for doesn't exist.
          </p>
        }
        extra={
          <AppButton
            Icon={HomeOutlined}
            href={'/'}
            buttonText={'Take Me Home'}
            classNames={`w-auto text-white text-sm bg-blue-500 hover:bg-blue-600 hover:text-white font-medium py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center shadow-lg hover:shadow-2xl transform hover:scale-110`}
          />
        }
      />
    </div>
  );
};

export default NotFoundPage;
