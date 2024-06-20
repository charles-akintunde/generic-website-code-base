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

import { Popconfirm } from 'antd';
import { EPageType, EUserRole } from '@/types/enums';

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
import usePage from '@/hooks/api-hooks/usePage';
import AppPopconfirm from '../AppPopconfirm';
import Link from 'next/link';

const PageListItem: React.FC = () => {
  const [viewContent, setViewContent] = useState<IPageMain | null>(null);
  const { handleEditButtonClick, pages, handleRemovePage } = usePage();

  console.log(pages, 'PAGES');

  const columns = [
    {
      title: 'Page Name',
      dataIndex: 'pageName',
      key: 'pageName',
      render: (text: string, record: IPageMain) => (
        <span className="font-medium">{text}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'pageType',
      key: 'pageType',
      render: (type: EPageType) => (
        <Badge className="mr-2 mb-2 lg:mr-4 lg:mb-0">
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
              className="mr-2 mb-2 lg:mr-4 lg:mb-0"
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            // onClick={() => setViewContent(record)}
          >
            <Link href={`${record.href}`}>
              <EyeOutlined />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditButtonClick(record)}
          >
            <EditOutlined />
          </Button>
          <AppPopconfirm
            entity={'page'}
            onDelete={() => handleRemovePage(record)}
          >
            <Button variant="destructive" size="sm">
              <DeleteOutlined />
            </Button>
          </AppPopconfirm>
        </div>
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
