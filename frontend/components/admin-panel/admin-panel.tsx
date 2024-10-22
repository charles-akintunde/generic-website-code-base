'use client';
import React from 'react';
import { Tabs } from 'antd';
import UserTab from './user-tab';
import PageTab from './page-tab';
import { containerPaddingStyles } from '../../styles/globals';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  {
    key: 'users',
    label: 'Users',
    children: <UserTab />,
  },
  {
    key: 'pages',
    label: 'Pages',
    children: <PageTab />,
  },
];

const AdminPanel: React.FC = () => {
  return (
    <section className={`${containerPaddingStyles} py-8`}>
      <div className="w-full">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </section>
  );
};

export default AdminPanel;
