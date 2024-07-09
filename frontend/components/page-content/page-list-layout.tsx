import React, { ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { IPageMain } from '@/types/componentInterfaces';
import { estimateReadingTime, formatDate } from '@/utils/helper';

interface PageListLayoutProps {
  children: ReactNode;
  page: IPageMain;
}

const PageListLayout: React.FC<PageListLayoutProps> = ({ page, children }) => {
  const contentName = String(page && page.pageContentName);
  const createdAt = formatDate(page.pageContentCreatedAt);
  //const estimatedReadTime = estimateReadingTime(page.pageContents);
  // const fullName = page.creatorFullName;
  console.log(page, 'KKKKKKK');
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-2">{contentName}</h1>
      <div className="flex items-center mb-4">
        <Avatar size="large" icon={<UserOutlined />} />
        <div className="ml-3">
          <div className="font-medium">{'Charles Akintunde'}</div>
          <div className="text-gray-500 text-sm">
            {'2'} min read · {createdAt}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageListLayout;
