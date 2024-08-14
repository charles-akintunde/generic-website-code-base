import {
  containerNoFlexPaddingStyles,
  containerPaddingStyles,
} from '@/styles/globals';
import React from 'react';
import { Divider } from 'antd';
import { FloatButton } from 'antd';
import Image from 'next/image';
import backgroundImage from '../../assets/images/page-list-img1.jpg';
import UploadPageContentImage from '../common/upload-page-content-image';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  titleImgUrl?: string;
  type?: 'singlePage' | 'pageList';
}

const PageLayout: React.FC<LayoutProps> = ({
  children,
  title,
  type = 'pageList',
}) => {
  return (
    <div className={type === 'singlePage' ? 'bg-white' : 'bg-white'}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <header className="relative w-full h-64 rounded-sm overflow-hidden">
          <Image
            src={backgroundImage}
            alt="Header Background"
            layout="fill"
            objectFit="cover"
            className="rounded-sm bg-pg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-sm">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-white">
              {title}
            </h1>
          </div>
        </header>
        {/* <Divider /> */}
        <main className="w-full rounded-xl min-h-screen z-20 ">
          <div>{children}</div>
          <FloatButton.BackTop visibilityHeight={400} />
          {type == 'singlePage' && <UploadPageContentImage />}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
