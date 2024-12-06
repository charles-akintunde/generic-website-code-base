'use-client';
import React from 'react';
import { Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useParams, useSearchParams } from 'next/navigation';
import AppButton from './button/app-button';
import { primarySolidButtonStyles } from '../../styles/globals';

const ErrorPage = ({ type }: { type: string }) => {
  

  switch (type) {
    case '404':
      return <NotFoundPage />;
    case 'access-denied':
      return <AccessDenied />;
    case 'internal-server-error':
      return <InternalServerError />;
    default:
      return <NotFoundPage />;
  }
};



const ErrorTypePage = () => {
    const searchParams = useSearchParams();
    const errorType = searchParams.get('type');
  
    return <ErrorPage type={errorType as string} />;
  };
  
  export default ErrorTypePage;


  const InternalServerError = () => {
    return (
      <div className='h-[calc(100vh-5rem)] overflow-hidden'>
        <div className="min-h-screen bg-gradient-to-r from-red-50 via-white to-red-100 flex flex-col items-center justify-center py-10 px-4 animate-fadeIn">
          <div className="max-w-lg text-center px-4 space-y-6">
            <Result
              status="500"
              title={
                <h1 className="text-6xl md:text-8xl font-extrabold text-red-600 drop-shadow-lg">
                  500
                </h1>
              }
              subTitle={
                <p className="text-lg md:text-xl text-gray-600 mt-2 italic">
                  Something went wrong on our end. We’re working on it!
                </p>
              }
              extra={
                <AppButton
                  Icon={HomeOutlined}
                  href={'/'}
                  buttonText={'Back to Safety'}
                  classNames={`w-full md:w-auto text-white text-sm bg-gradient-to-r from-red-500 to-orange-500 hover:bg-gradient-to-l hover:from-orange-500 hover:to-red-500 font-medium py-3 px-8 rounded-full transition duration-300 ease-in-out flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110`}
                />
              }
            />
          </div>
        </div>
      </div>
    );
  };
  

  
  
   
  const AccessDenied = () => {
    return (
      <div className='h-[calc(100vh-5rem)] overflow-hidden'>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex flex-col items-center justify-center py-10 px-4 animate-fadeIn">
          <div className="max-w-lg text-center px-4">
            <Result
              status="403"
              title={
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 drop-shadow-lg">
                  401
                </h1>
              }
              subTitle={
                <p className="text-base md:text-lg text-gray-700 mt-2 italic">
                  You do not have permission to access this page.
                </p>
              }
              extra={
                <AppButton
                  Icon={HomeOutlined}
                  href={'/'}
                  buttonText={'Take Me Home'}
                  classNames={`w-full md:w-auto text-white text-sm bg-blue-500 hover:bg-blue-600 font-medium py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 hover:text-white`}
                />
              }
            />
          </div>
        </div>
      </div>
    );
  };
  

  
  const NotFoundPage = () => {
    return (
      <div className='h-[calc(100vh-5rem)] overflow-hidden'>
      <div className="min-h-screen bg-gradient-to-r  from-blue-50 to-white flex flex-col items-center justify-center space-y-6 animate-fadeIn">
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
      </div>
  
    );
  };
  