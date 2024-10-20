import useUserInfo from '@/hooks/api-hooks/use-user-info';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import React from 'react';
import UserListItem from '../page/user-list/user-list-item';
import CreatePageDialog from '../common/form/create-page';

const UserTab = () => {
  return (
    <main className="">
      <header className="flex justify-between items-center py-4 ">
        <h2 className="text-xl font-bold">User Management Panel</h2>
      </header>
      <section className="bg-gray-100 rounded-lg shadow-sm p-4 mt-4">
        <UserListItem />
      </section>
    </main>
  );
};

export default UserTab;
