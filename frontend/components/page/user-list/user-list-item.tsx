'use-client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { EUserRole, EUserStatus } from '@/types/enums';
import { Avatar } from 'antd';
import ActionsButtons from '@/components/common/action-buttons';
import { Table } from 'antd';
import { IUserBase, IUserList } from '@/types/componentInterfaces';
import { useGetUsersQuery } from '@/api/userApi';
import {
  formatDate,
  mapToIIUserList,
  userRoleLabels,
  userStatusLabels,
} from '@/utils/helper';

import { userColumns } from '@/utils/tableColumns';
import useUserInfo from '@/hooks/api-hooks/use-user-info';

const UserListItem = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [fetchParams, setFetchParams] = useState(pagination);
  const [totalUserCount, setTotalUserCount] = useState<number>();
  const { handleRemoveUser } = useUserInfo();
  const { data: usersResponseData, isLoading: isUsersFetchLoading } =
    useGetUsersQuery({
      page: fetchParams.current,
      limit: fetchParams.pageSize,
    });

  const [users, setUsers] = useState<IUserBase[]>();

  useEffect(() => {
    if (usersResponseData && usersResponseData.data) {
      const { data } = usersResponseData;
      const usersData: IUserList = mapToIIUserList(usersResponseData.data);

      if (usersData.users) {
        setUsers(usersData?.users);
        setPagination({
          ...pagination,
        });
        setTotalUserCount(usersData.totalUserCount);
      }
    }
  }, [usersResponseData]);

  const handleTableChange = (tablePagination) => {
    const { current, pageSize } = tablePagination;
    setFetchParams((prev) => ({
      ...prev,
      current,
      pageSize,
    }));

    setPagination((prev) => ({
      ...prev,
      current,
      pageSize,
    }));
  };

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'uiFirstName',
      key: 'userName',
      render: (_: any, record: IUserBase) => (
        <div className="flex space-x-2 justify-start items-center">
          <Avatar src={<img src={record.uiPhotoUrl} alt="avatar" />} />
          <a
            href={''}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <span className="font-medium">
              {record.uiFirstName} {record.uiLastName}
            </span>
          </a>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'uiEmail',
      key: 'email',
    },

    {
      title: 'Role',
      dataIndex: 'uiRole',
      key: 'role',
      render: (role: EUserRole) => (
        <Badge
          className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-indigo-200 bg-opacity-50 text-indigo-500 px-2 py-1 hover:bg-indigo-200 hover:bg-opacity-50"
          variant="secondary"
        >
          {userRoleLabels[role]}
        </Badge>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'uiStatus',
      key: 'status',
      render: (status: EUserStatus) => (
        <Badge
          className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-blue-200 bg-opacity-50 text-blue-500 px-2 py-1 hover:bg-blue-200 hover:bg-opacity-50"
          variant="secondary"
        >
          {userStatusLabels[status]}
        </Badge>
      ),
    },
    {
      title: 'Reg Date',
      dataIndex: 'uiRegDate',
      key: 'regDate',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IUserBase) => (
        <ActionsButtons
          entity="user"
          handleEditButtonClick={() => {}}
          handleRemove={handleRemoveUser}
          record={record}
        />
      ),
    },
  ];

  console.log(users, 'USERS');

  return (
    <div className="p-4">
      {users && (
        <Table
          columns={userColumns}
          dataSource={users && users}
          pagination={{
            pageSize: pagination.pageSize,
            total: totalUserCount || 0,
          }}
          loading={isUsersFetchLoading}
          onChange={handleTableChange}
          rowKey="uiId"
        />
      )}
    </div>
  );
};

export default UserListItem;
