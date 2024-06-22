import React from 'react';
import { PlateEditor } from '../plate/plate';
import PageLayout from '../page/layout';
import AppButton from '../common/button/app-button';
import { primarySolidButtonStyles } from '@/styles/globals';

const PageContent = () => {
  return (
    <PageLayout title="Create Page Content">
      {/* <header className="flex justify-between items-center py-4">
        <h2 className="text-xl font-bold">Page Content</h2>
        <AppButton
          buttonText="Submit"
          // Icon={PlusIcon}
          href="/events/create-page-content"
          classNames={primarySolidButtonStyles}
        />
      </header> */}
      <PlateEditor />
    </PageLayout>
  );
};

export default PageContent;
