import React, { useEffect, useState } from 'react';
import { FloatButton } from 'antd';
import Image from 'next/image';
import backgroundImage from '../../assets/images/page-list-img1.jpg'; 

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  type?: 'singlePage' | 'pageList';
  useGradient?: boolean; 
}

const gradients = [
  'bg-gradient-to-r from-blue-100 via-blue-100 to-purple-100',
  'bg-gradient-to-r from-green-100 via-teal-100 to-blue-100',
  'bg-gradient-to-r from-purple-100 via-pink-100 to-red-100',
  'bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100',
  'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100',
];


const PageLayout: React.FC<LayoutProps> = ({
  children,
  title,
  type = 'pageList',
  useGradient = true, 
}) => {
  const [gradient, setGradient] = useState<string>(gradients[0]);

  useEffect(() => {
    const randomGradient = () => gradients[Math.floor(Math.random() * gradients.length)];
    setGradient(randomGradient());
  }, []);

  return (
    <div className={type === 'singlePage' ? 'bg-pg' : 'bg-pg'}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <header className="relative w-full h-64 rounded-sm overflow-hidden">
          {useGradient ? (
            
            <div className={`absolute inset-0 ${gradient} rounded-sm`}></div>
          ) : (
            
            <Image
              src={backgroundImage}
              alt="Header Background"
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-sm">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-white">
              {title}
            </h1>
          </div>
        </header>
        <main className="w-full rounded-xl min-h-screen z-20">
          <div>{children}</div>
          <FloatButton.BackTop visibilityHeight={400} />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
