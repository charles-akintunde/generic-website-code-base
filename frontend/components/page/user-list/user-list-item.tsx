'use-client';
import React, { useEffect, useState } from 'react';
import { EUserStatus, EMemberPosition, EUserRole } from '../../../types/enums';
import { Avatar, Tooltip } from 'antd';
import { Table } from 'antd';
import { ExternalLink } from 'lucide-react';
import {
  userStatusLabels,
  formatDate,
  handleRoutingOnError,
  mapToIIUserList,
  memberPositionLabels,
  positionColors,
  roleColors,
  statusColors,
  userRoleLabels,
} from '../../../utils/helper';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import useUserInfo from '../../../hooks/api-hooks/use-user-info';

import { IUserBase, IUserList } from '../../../types/componentInterfaces';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import {
  setEditingUser,
  toggleCreateUserDialog,
} from '../../../store/slice/userSlice';
import { Badge } from '../../ui/badge';
import { transitionStyles } from '../../../styles/globals';
import ActionsButtons from '../../common/action-buttons';
import { UserRoleStatusDialog } from '../../common/form/user-profile-form';
import { useGetUsersQuery } from '../../../api/pageApi';

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
          <Tooltip
            placement="left"
            title={`${record.uiFirstName} ${record.uiLastName}`}
          >
            <a
              href={`/user-profile/${record.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 space-x-1 text-left flex items-center text-gray-700"
            >
              <span className="font-medium truncate w-20 text-nowrap">
                {record.uiFirstName} {record.uiLastName}
              </span>
              <ExternalLink className="h-3 w-3 text-blue-500" />
            </a>
          </Tooltip>
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
      render: (roles: EUserRole[]) => (
        <div className="flex gap-1 flex-wrap ">
          {roles.map((role, index) => (
            <Badge
              className={`${classNames(roleColors[role])} cursor-pointer hover:bg-inherit ${transitionStyles}`}
            >
              {userRoleLabels[role]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'uiStatus',
      key: 'status',
      render: (status: EUserStatus) => (
        <Badge
          className={`${classNames(statusColors[status])} cursor-pointer hover:bg-inherit ${transitionStyles}`}
        >
          {userStatusLabels[status]}
        </Badge>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'uiMemberPosition',
      key: 'memberPosition',
      render: (position: EMemberPosition) => (
        <Badge
          className={`${classNames(positionColors[position])} cursor-pointer hover:bg-inherit ${transitionStyles}`}
        >
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
            // @ts-ignore
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
