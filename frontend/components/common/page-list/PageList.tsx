import React, { useState } from 'react';
import { EPageType, EUserRole } from '@/types/enums';
import PageListItem from './PageListItem';
import { IPage } from '@/types/componentInterfaces';
const PageList: React.FC<{ pages: IPage[] }> = ({ pages }) => {
  return <div>{/* <PageListItem key={page.pageName} pages={pages} /> */}</div>;
};

export default PageList;
