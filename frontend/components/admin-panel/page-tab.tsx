'use client';
import React from 'react';
import CreatePageDialog from '../common/form/create-page';
import PageListItem from '../page-list/page-list-item';
const PageTab = () => {
  return (
    <main className="">
      <header className="flex justify-between items-center py-4 ">
        <h2 className="text-xl font-bold">Page Management</h2>
        <CreatePageDialog />
      </header>
      <section className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <PageListItem />
      </section>
    </main>
  );
};

export default PageTab;
