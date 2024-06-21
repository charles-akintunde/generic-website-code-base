import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserTab from './user-tab';
import PageTab from './page-tab';
import { containerPaddingStyles } from '@/styles/globals';

const AdminPanel = () => {
  return (
    <section className={`${containerPaddingStyles} py-8`}>
      <Tabs defaultValue="pages" className="w-full ">
        <TabsList className="">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Users Tab Content */}
        <TabsContent value="users">
          <UserTab />
        </TabsContent>

        {/* Pages Tab Content */}
        <TabsContent value="pages">
          <div className="flex flex-col space-y-4">
            <PageTab />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdminPanel;
