'use-client';
import React from 'react';
import { Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import AppButton from '../../../../../components/common/button/app-button';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex flex-col items-center justify-center py-10 px-4 animate-fadeIn">
      <Result
        status="403"
        title={
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 drop-shadow-lg">
            Unauthorized
          </h1>
        }
        subTitle={
          <p className="text-lg text-gray-700 mt-2 italic">
            You do not have permission to access this page.
          </p>
        }
        extra={
          <AppButton
            Icon={HomeOutlined}
            href={'/'}
            buttonText={'Take Me Home'}
            classNames={`w-auto text-white text-sm bg-blue-500 hover:bg-blue-600 font-medium py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center shadow-lg hover:shadow-2xl transform hover:scale-110 hover:text-white`}
          />
        }
      />
    </div>
  );
};

export default AccessDenied;
