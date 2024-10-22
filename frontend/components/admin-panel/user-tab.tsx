import React from 'react';
import UserListItem from '../page/user-list/user-list-item';

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
