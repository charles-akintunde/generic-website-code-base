'use-client';
import React, { useEffect, useState } from 'react';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { Badge } from '@/components/ui/badge';
import { Table } from 'antd';
import { IUserBase } from '@/types/componentInterfaces';

const UserListItem = () => {
  const { currentUser, canEdit } = useUserLogin();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    lastFirstName: '',
    lastLastName: '',
    lastUUID: '',
  });
  const { usersData, isUsersFetchLoading } = useUserInfo({
    lastFirstName: pagination.lastFirstName,
    lastLastName: pagination.lastLastName,
    lastUUID: pagination.lastUUID,
    limit: pagination.pageSize,
  });
  const [users, setUsers] = useState<IUserBase[]>();

  useEffect(() => {
    // Trigger refetch when pagination changes
  }, [pagination]);

  useEffect(() => {
    if (usersData && usersData?.users) {
      setUsers(usersData?.users);
    }
  }, [usersData]);

  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'uiEmail',
      key: 'email',
    },
    {
      title: 'First Name',
      dataIndex: 'uiFirstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'uiLastName',
      key: 'lastName',
    },

    {
      title: 'Role',
      dataIndex: 'uiRole',
      key: 'role',
      render: (role: string) => <Badge>{role}</Badge>,
    },
    {
      title: 'Status',
      dataIndex: 'uiStatus',
      key: 'status',
      render: (status: string) => (
        <Badge color={status === '0' ? 'red' : 'green'}>{status}</Badge>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'uiRegDate',
      key: 'regDate',
    },
  ];

  console.log(usersData, 'USERS');

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={users && users}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: users?.length || 0,
        }}
        loading={isUsersFetchLoading}
        onChange={handleTableChange}
        rowKey="uiId"
      />
    </div>
  );
};

export default UserListItem;
