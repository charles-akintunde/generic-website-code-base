import useUserLogin from '@/hooks/api-hooks/use-user-login';
import React from 'react';

const UserTab = () => {
  const { currentUser, canEdit } = useUserLogin();

  return (
    <main className="">
      <header className="flex justify-between items-center py-4 ">
        <h2 className="text-xl font-bold">User Management Panel</h2>
        {/* {canEdit && <CreatePageDialog />} */}
      </header>
      <section className="bg-white rounded-lg shadow-sm p-4 mt-4">
        {/* <PageListItem /> */}
      </section>
    </main>
  );
};

export default UserTab;
