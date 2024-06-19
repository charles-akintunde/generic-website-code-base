import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreatePageDialog from '../common/form/CreatePage';
import { EPageType, EUserRole } from '@/types/enums';
import PageList from '../common/page-list/PageList';
import { IPageMain } from '@/types/componentInterfaces';
import PageListItem from '../common/page-list/PageListItem';
import usePage from '@/hooks/api-hooks/usePage';

const pages1: IPageMain[] = [
  {
    pageName: 'Home',
    pageType: EPageType.SinglePage,
    pagePermission: [EUserRole.Public],
    pageContent: [
      { display: '/blog/post1', name: 'Post 1' },
      { display: '/blog/post2', name: 'Post 2' },
    ],
    isHidden: true,
  },
  {
    pageName: 'About Us',
    pageType: EPageType.SinglePage,
    pagePermission: [EUserRole.Public, EUserRole.Member],
    pageContent: [
      { display: '/blog/post1', name: 'Post 1' },
      { display: '/blog/post2', name: 'Post 2' },
    ],
    isHidden: false,
  },

  // ... more page data
];
const PageTab = () => {
  const { pages } = usePage();
  return (
    <main className="">
      <header className="flex justify-between items-center py-4 bg-white">
        <h2 className="text-xl font-bold">Page Management</h2>
        <CreatePageDialog />
      </header>
      <section>
        <PageListItem pages={pages} />
      </section>
    </main>
  );
};

export default PageTab;
