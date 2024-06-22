import React from 'react';
import PageLayout from './layout';
import { PlateEditor } from '../plate/plate';
import PageContentCard from '../page-content/page-content-card';
import PageContents from '../page-content/page-contents';

const DynamicPage = () => {
  return (
    <PageLayout title="ACNT Blogs">
      <PageContents />
    </PageLayout>
  );
};

export default DynamicPage;
