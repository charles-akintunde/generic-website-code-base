'use client';
import React from 'react';
import CreatePageDialog from '../common/form/create-page';
import PageListItem from '../page-list/page-list-item';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
const PageTab = () => {
  const { currentUser, canEdit } = useUserLogin();
  return (
    <main className="">
      <header className="flex justify-between items-center py-4 ">
        <h2 className="text-xl font-bold">Page Management</h2>
        {canEdit && <CreatePageDialog />}
      </header>
      <section className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <PageListItem />
      </section>
    </main>
  );
};

export default PageTab;
