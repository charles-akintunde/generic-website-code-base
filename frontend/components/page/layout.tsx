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

export const gradients = [
  'bg-gradient-to-r from-blue-100 via-blue-100 to-purple-100',
  'bg-gradient-to-r from-green-100 via-teal-100 to-blue-100',
  'bg-gradient-to-r from-purple-100 via-pink-100 to-red-100',
  'bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100',
  'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100',
  'bg-gradient-to-r from-teal-100 via-green-200 to-lime-100',
  'bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100',
  'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300',
  'bg-gradient-to-r from-sky-100 via-sky-200 to-indigo-100',
  'bg-gradient-to-r from-emerald-100 via-lime-100 to-yellow-100',
  'bg-gradient-to-r from-cyan-100 via-blue-200 to-purple-200',
  'bg-gradient-to-r from-rose-100 via-pink-200 to-fuchsia-200',
  'bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200',
  'bg-gradient-to-r from-blue-50 via-purple-100 to-indigo-200',
  'bg-gradient-to-r from-green-50 via-teal-100 to-cyan-200',
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
