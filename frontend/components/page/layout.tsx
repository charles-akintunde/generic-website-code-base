import {
  containerNoFlexPaddingStyles,
  containerPaddingStyles,
} from '@/styles/globals';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  titleImgUrl?: string;
}

const PageLayout: React.FC<LayoutProps> = ({
  children,
  title,
  titleImgUrl,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-pg">
      <header
        className="h-96 z-10 flex flex-col items-center justify-center text-white w-full relative"
        style={{
          backgroundImage: `url(${titleImgUrl ? titleImgUrl : '/assets/images/background-img.webp'})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Overlay div */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <h1 className="text-center text-3xl font-extrabold relative z-20">
          {title}
        </h1>
      </header>
      <main className="w-full rounded-3xl min-h-screen z-20">
        <div className={``}>{children}</div>
      </main>
    </div>
  );
};

export default PageLayout;
