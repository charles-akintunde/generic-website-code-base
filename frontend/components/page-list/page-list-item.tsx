'use client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link2Icon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Popconfirm } from 'antd';
import { EPageType, EUserRole } from '@/types/enums';
import { EllipsisVertical } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTypeLabels, userRoleLabels } from '@/utils/helper';
import {
  IPageMain,
  IPageContentItem,
  IPageListItem,
} from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import AppPopconfirm from '../common/app-popup-confirm';
import Link from 'next/link';
import { record } from 'zod';
import useUserLogin from '@/hooks/api-hooks/use-user-login';

const PageListItem: React.FC = () => {
  const [viewContent, setViewContent] = useState<IPageMain | null>(null);
  const { handleEditButtonClick, pages, handleRemovePage } = usePage();
  const { currentUser, canEdit } = useUserLogin();

  interface IActionsColumnProps {
    record: IPageMain;
    handleEditButtonClick: (record: any) => void;
    handleRemovePage: (record: any) => void;
  }

  const ActionsColumn: React.FC<IActionsColumnProps> = ({
    record,
    handleEditButtonClick,
    handleRemovePage,
  }) => {
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
                <EditOutlined className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500 font-medium">Edit</span>
              </Button>
              <AppPopconfirm
                entity="page"
                onDelete={() => handleRemovePage(record)}
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

  const columns = [
    {
      title: 'Page Name',
      dataIndex: 'pageName',
      key: 'pageName',
      render: (text: string, record: IPageMain) => (
        <div className="flex items-center justify-between">
          <a
            href={record.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <Link2Icon className="mr-2 h-4 w-4" />
            <span className="font-medium"> {text}</span>
          </a>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'pageType',
      key: 'pageType',
      render: (type: EPageType) => (
        <Badge className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-blue-100 bg-opacity-50 text-blue-400 px-2 py-1 hover:bg-blue-100 hover:bg-opacity-50">
          {pageTypeLabels[type]}
        </Badge>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'pagePermission',
      key: 'pagePermission',
      render: (roles: EUserRole[]) => (
        <div className="flex flex-wrap">
          {roles.map((role, index) => (
            <Badge
              key={index}
              className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-gray-200 bg-opacity-50 text-gray-500 px-2 py-1 hover:bg-gray-200 hover:bg-opacity-50"
              variant="secondary"
            >
              {userRoleLabels[role]}
            </Badge>
          ))}
        </div>
      ),
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'isHidden',
    //   key: 'isHidden',
    //   render: (status: boolean, record: IPageMain) => (
    //     <span className="font-medium">{status ? 'Hidden' : 'Visible'}</span>
    //   ),
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IPageMain) => (
        <>
          {canEdit && (
            <ActionsColumn
              handleEditButtonClick={handleEditButtonClick}
              handleRemovePage={handleRemovePage}
              record={record}
            />
          )}
        </>
      ),
    },
  ];

  const handleEdit = (record: IPageMain) => {
    // Edit handler logic
  };

  const handleDelete = (record: IPageMain) => {
    // Delete handler logic
  };
  const handleCloseDialog = () => {
    setViewContent(null);
  };

  function handleContentEdit(content: IPageContentItem) {}

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.pageName}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render
                    ? column.render(page[column?.dataIndex], page)
                    : page[column.dataIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={viewContent !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {viewContent?.pageName} Contents
              </h2>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {viewContent &&
              viewContent.pageContent &&
              viewContent.pageContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between">
                  <a
                    href={content.display}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <Link2Icon className="mr-2 h-4 w-4" />
                    {content.name}
                  </a>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContentEdit(content)}
                    >
                      <EditOutlined />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleContentEdit(content)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageListItem;
