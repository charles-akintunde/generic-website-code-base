import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { EllipsisVertical } from 'lucide-react';
import AppPopconfirm from './app-popup-confirm';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAppSelector } from '../../hooks/redux-hooks';

interface IActionProps {
  href?: string;
  entity: string;
  record: any;
  handleEditButtonClick: (record: any) => void;
  handleRemove: (recordId: any) => void;
  hasAccess?: boolean;
}

const ActionsButtons: React.FC<IActionProps> = ({
  href,
  entity,
  record,
  handleEditButtonClick,
  handleRemove,
  hasAccess = true,
}) => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;

  if (!(canEdit && hasAccess)) {
    return <></>;
  }

  return (
    <div className="flex gap-1 items-center">
      <Popover>
        <PopoverTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="bg-white rounded-lg w-auto shadow-lg p-2">
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => handleEditButtonClick(record)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 bg-inherit rounded text-left"
            >
              {href ? (
                <Link href={href}>
                  <EditOutlined className="w-4 h-4 text-primary" />
                  <span className="pl-3 text-sm text-primary font-medium">
                    Edit
                  </span>
                </Link>
              ) : (
                <>
                  <EditOutlined className="w-4 h-4 text-primary" />
                  <span className="pl-3 text-sm text-primary font-medium">
                    Edit
                  </span>
                </>
              )}
            </Button>
            <AppPopconfirm
              entity={entity}
              onDelete={() => handleRemove(record)}
            >
              <Button
                size="sm"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left bg-inherit text-red-500"
              >
                <DeleteOutlined className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </Button>
            </AppPopconfirm>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsButtons;
