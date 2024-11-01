import React from 'react';
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(
  () => import('../../../../../../components/admin-panel/admin-panel'),
  {
    ssr: false,
  }
);

const AdminPage = () => {
  return (
    <div className="bg-pg min-h-screen">
      <AdminPanel />;
    </div>
  );
};

export default AdminPage;
