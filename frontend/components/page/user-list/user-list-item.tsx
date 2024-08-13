'use-client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { EMemberPosition, EUserRole, EUserStatus } from '@/types/enums';
import { Avatar } from 'antd';
import ActionsButtons from '@/components/common/action-buttons';
import { Table } from 'antd';
import { IUserBase, IUserList } from '@/types/componentInterfaces';
import { useGetUsersQuery } from '@/api/userApi';
import { ExternalLink } from 'lucide-react';
import {
  formatDate,
  handleRoutingOnError,
  mapToIIUserList,
  memberPositionLabels,
  positionColors,
  roleBadgeClasses,
  roleColors,
  statusBadgeClasses,
  statusColors,
  userRoleLabels,
  userStatusLabels,
} from '@/utils/helper';
import classNames from 'classnames';

import { userColumns } from '@/utils/tableColumns';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { useAppDispatch } from '@/hooks/redux-hooks';
import {
  setEditingUser,
  toggleCreateUserDialog,
} from '@/store/slice/userSlice';
import { UserRoleStatusDialog } from '@/components/common/form/user-profile-form';
import { routeModule } from 'next/dist/build/templates/app-page';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { useRouter } from 'next/navigation';

const UserListItem = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [fetchParams, setFetchParams] = useState(pagination);
  const [totalUserCount, setTotalUserCount] = useState<number>();
  const { handleRemoveUser } = useUserInfo();
  const {
    data: usersResponseData,
    isLoading: isUsersFetchLoading,
    isError: hasUserFetchError,
    error: userFetchError,
    refetch: refetchUsersList,
  } = useGetUsersQuery({
    page: fetchParams.current,
    limit: fetchParams.pageSize,
  });
  const [users, setUsers] = useState<IUserBase[]>();
  const dispatch = useAppDispatch();
  const router = useRouter();

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

  const handleTableChange = (tablePagination: any) => {
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

  const handleEditButtonClick = (record: IUserBase) => {
    dispatch(setEditingUser(record));
    dispatch(toggleCreateUserDialog());
  };

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'uiFirstName',
      fixed: 'left',
      key: 'userName',
      render: (_: any, record: IUserBase) => (
        <div className="flex space-x-2 justify-start text-left items-center">
          <Avatar
            src={record.uiPhoto as string}
            className="text-gray-700"
            style={{ backgroundColor: '#d9d9d9' }}
          >
            {record.uiFirstName[0]}
            {record.uiLastName[0]}
          </Avatar>
          <a
            href={`/user-profile/${record.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 space-x-1 text-left flex items-center text-gray-700"
          >
            <span className="font-medium truncate w-20 text-nowrap">
              {record.uiFirstName} {record.uiLastName}
            </span>
            <ExternalLink className="h-3 w-3 " />
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
        <>
          <Badge className={classNames(roleColors[role])}>
            {userRoleLabels[role]}
          </Badge>
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'uiStatus',
      key: 'status',
      render: (status: EUserStatus) => (
        <Badge className={classNames(statusColors[status])}>
          {userStatusLabels[status]}
        </Badge>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'uiMemberPosition',
      key: 'memberPosition',
      render: (position: EMemberPosition) => (
        <Badge className={classNames(positionColors[position])}>
          {memberPositionLabels[position]}
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
      fixed: 'right',
      render: (_: any, record: IUserBase) => (
        <ActionsButtons
          entity="user"
          handleEditButtonClick={() => handleEditButtonClick(record)}
          handleRemove={handleRemoveUser}
          record={record}
        />
      ),
    },
  ];

  useEffect(() => {
    handleRoutingOnError(router, hasUserFetchError, userFetchError);
  }, [hasUserFetchError, userFetchError, router]);

  return (
    <div className="p-4">
      {users && (
        <>
          <Table
            scroll={{ x: 1400 }}
            columns={userColumns}
            dataSource={users && users}
            pagination={{
              pageSize: pagination.pageSize,
              total: totalUserCount || 0,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15'],
            }}
            loading={isUsersFetchLoading}
            onChange={handleTableChange}
            rowKey="uiId"
          />
          <UserRoleStatusDialog />
        </>
      )}
    </div>
  );
};

export default UserListItem;
