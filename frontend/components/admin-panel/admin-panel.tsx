'use client';
import React from 'react';
import { Result, Tabs } from 'antd';
import UserTab from './user-tab';
import PageTab from './page-tab';
import { containerPaddingStyles } from '../../styles/globals';
import type { TabsProps } from 'antd';
import { useAppSelector } from '../../hooks/redux-hooks';
import { HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import AppButton from '../common/button/app-button';

const items: TabsProps['items'] = [
  {
    key: 'pages',
    label: 'Pages',
    children: <PageTab />,
  },
  {
    key: 'users',
    label: 'Users',
    children: <UserTab />,
  },
];

const AdminPanel: React.FC = () => {
  const router = useRouter();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;

  // if(!canEdit){
  //   return    <Result
  //   status="403"
  //   title={
  //     <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 drop-shadow-lg">
  //       Unauthorized
  //     </h1>
  //   }
  //   subTitle={
  //     <p className="text-lg text-gray-700 mt-2 italic">
  //       You do not have permission to access this page.
  //     </p>
  //   }
  //   extra={
  //     <AppButton
  //       Icon={HomeOutlined}
  //       href={'/'}
  //       buttonText={'Take Me Home'}
  //       classNames={`w-auto text-white text-sm bg-blue-500 hover:bg-blue-600 font-medium py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center shadow-lg hover:shadow-2xl transform hover:scale-110 hover:text-white`}
  //     />
  //   }
  // />
  // }
  return (
    <section className={`${containerPaddingStyles} py-8`}>
      <div className="w-full">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </section>
  );
};

export default AdminPanel;
