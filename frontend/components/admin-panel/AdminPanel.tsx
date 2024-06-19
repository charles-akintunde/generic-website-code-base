import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserTab from './UserTab';
import PageTab from './PageTab';

const AdminPanel = () => {
  return (
    <Tabs defaultValue="pages" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
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
  );
};

export default AdminPanel;
