'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link2Icon } from '@radix-ui/react-icons';
import { EPageType, EUserRole } from '@/types/enums';
import {
  mapPageToIPageMain,
  pageTypeLabels,
  userRoleLabels,
} from '@/utils/helper';
import { IPageList, IPageMain } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import ActionsButtons from '@/components/common/action-buttons';
import { useGetPagesWithOffsetQuery } from '@/api/pageApi';

const PageListItem: React.FC = () => {
  const [viewContent, setViewContent] = useState<IPageMain | null>(null);
  const { handleEditButtonClick, handleRemovePage } = usePage();
  const { currentUser, canEdit } = useUserLogin();
  const [pages, setPages] = useState<IPageMain[]>();
  const [totalPageCount, setTotalPageCount] = useState<number>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [fetchParams, setFetchParams] = useState(pagination);
  const {
    data: pagesResponse,
    isError: hasPagesFetchError,
    isSuccess: isPagesFetchSuccess,
    isLoading: isPagesFetchLoading,
  } = useGetPagesWithOffsetQuery({
    PG_Limit: fetchParams.pageSize,
    PG_Number: fetchParams.current,
  });

  useEffect(() => {
    if (pagesResponse && pagesResponse.data) {
      const { data } = pagesResponse;
      const pagesData: IPageList = mapPageToIPageMain(data);
      console.log(pagesData, 'PAGEDATAQQQQQQQQ');

      if (pagesData && pagesData.pages && pagesData.pgTotalPageCount) {
        setPagination({
          ...pagination,
        });
        setTotalPageCount(pagesData.pgTotalPageCount);
        setPages(pagesData.pages);
      }
    }
  }, [pagesResponse]);

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
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IPageMain) => (
        <>
          {canEdit && (
            <>
              <ActionsButtons
                entity="page"
                handleEditButtonClick={handleEditButtonClick}
                handleRemove={handleRemovePage}
                record={record}
              />
            </>
          )}
        </>
      ),
    },
  ];

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

  return (
    <div className=" space-y-4">
      <Table
        columns={columns}
        loading={isPagesFetchLoading}
        dataSource={pages}
        rowKey="pageId"
        onChange={handleTableChange}
        pagination={{
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15'],
          total: totalPageCount,
        }}
      />
    </div>
  );
};

export default PageListItem;
