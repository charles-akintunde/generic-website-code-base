import React from 'react';
import AdminPanel from '@/components/admin-panel/admin-panel';
import { systemMenuItems } from '@/components/hoc/layout/menu-items';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { hasPermission } from '@/utils/helper';

const AdminPage = () => {
  return (
    <div className="bg-pg min-h-screen">
      <AdminPanel />;
    </div>
  );
};

export default AdminPage;
