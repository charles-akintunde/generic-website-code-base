import { IReactNode } from '../../types/componentInterfaces';
import React from 'react';
import Image from 'next/image';
import authImage from '@/assets/images/auth-image.webp';
import Logo from '../common/logo';

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-pg">
      {/* Content (Login/Create Account) */}
      <div className="w-full md:w-1/2 max-w-xl px-8 py-12 md:py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="mb-3">
            <Logo width={800} height={100} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
