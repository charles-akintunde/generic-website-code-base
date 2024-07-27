import {
  containerNoFlexPaddingStyles,
  containerPaddingStyles,
} from '@/styles/globals';
import React from 'react';
import { Divider } from 'antd';
import { FloatButton } from 'antd';

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
    <div className={type == 'singlePage' ? 'bg-white' : 'bg-pg'}>
      <div
        className={` flex flex-col items-center justify-center min-h-screen `}
      >
        <header className="py-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center">
            {title}
          </h1>
        </header>
        <Divider />
        <main className="w-full rounded-3xl min-h-screen z-20 ">
          <div>{children}</div>
          <FloatButton.BackTop visibilityHeight={400} />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
