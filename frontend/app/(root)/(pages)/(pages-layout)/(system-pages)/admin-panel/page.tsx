import React from 'react';
import dynamic from 'next/dynamic';
import { containerNoFlexPaddingStyles } from '../../../../../../styles/globals';

const AdminPanel = dynamic(
  () => import('../../../../../../components/admin-panel/admin-panel'),
  {
    ssr: false,
  }
);

const AdminPage = () => {
  return (
    <div className="bg-pg min-h-screen">
      <div className={`${containerNoFlexPaddingStyles}`}>
      <AdminPanel />;
      </div>
   
    </div>
  );
};

export default AdminPage;
