import {
  containerNoFlexPaddingStyles,
  containerPaddingStyles,
} from '@/styles/globals';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const PageLayout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col min-h-screen bg-pg">
      <header
        className="h-64 z-10 flex flex-col items-center justify-center text-white w-full bg-gray-500 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: 'url(/assets/images/background-img.webp)',
        }}
      >
        <h1 className="text-center text-3xl font-extrabold ">{title}</h1>
      </header>
      <main className=" w-full rounded-3xl min-h-screen z-20">
        <div className={``}>{children}</div>
      </main>
    </div>
  );
};

export default PageLayout;
