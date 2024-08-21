import { Badge } from '@/components/ui/badge';
import { IUserBase } from '@/types/componentInterfaces';
import { EUserRole, EUserStatus } from '@/types/enums';
import { Avatar } from 'antd';
import { formatDate, userRoleLabels, userStatusLabels } from './helper';
import ActionsButtons from '@/components/common/action-buttons';

export const userColumns = [
  {
    title: 'Name',
    dataIndex: 'uiFirstName',
    key: 'userName',
    render: (text: string, record: IUserBase) => (
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
        entity="page"
        handleEditButtonClick={() => {}}
        handleRemove={() => {}}
        record={record}
      />
    ),
  },
];
