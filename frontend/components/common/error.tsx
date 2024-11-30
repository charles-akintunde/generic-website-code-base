'use-client';
import React from 'react';
import { Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { primarySolidButtonStyles } from '../../styles/globals';
import AppButton from './button/app-button';


const InternalServerError  = () => {
  return (
    <div className='overflow-hidden'>
   <div className="min-h-screen bg-gradient-to-r from-red-50 to-white flex flex-col items-center justify-center">
      <Result
        status="500"
        title="Internal Server Error"
        subTitle="Sorry, something went wrong on the server."
        extra={
          <AppButton
            Icon={HomeOutlined}
            href={'/'}
            buttonText={'Take Me Home'}
            classNames={`w-auto ${primarySolidButtonStyles} shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300`}
          />
        }
      />
    </div>
    </div>
 
  );
};

export default InternalServerError;
