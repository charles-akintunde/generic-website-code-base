'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, Tooltip } from 'antd';
import { EPageType, EUserRole } from '@/types/enums';
import {
  handleRoutingOnError,
  mapPageToIPageMain,
  pageTypeLabels,
  userRoleLabels,
} from '@/utils/helper';
import { IPageList, IPageMain } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import ActionsButtons from '@/components/common/action-buttons';
import { useGetPagesWithOffsetQuery } from '@/api/pageApi';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux-hooks';
import { ExternalLink } from 'lucide-react';

const PageListItem: React.FC = () => {
  const router = useRouter();
  const { handleEditButtonClick, handleRemovePage } = usePage();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const uiIsSuperAdmin = uiActiveUser.uiIsSuperAdmin;
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
    error: pagesFetchError,
    refetch: refetchPages,
  } = useGetPagesWithOffsetQuery({
    PG_Limit: fetchParams.pageSize,
    PG_Number: fetchParams.current,
  });

  console.log(pagesResponse, 'pagesResponse');

  useEffect(() => {
    if (pagesResponse && pagesResponse.data) {
      const { data } = pagesResponse;
      const pagesData: IPageList = mapPageToIPageMain(data);
      if (pagesData && pagesData.pages && pagesData.pgTotalPageCount) {
        setPagination({
          ...pagination,
        });
        setTotalPageCount(pagesData.pgTotalPageCount);
        setPages(pagesData.pages);
      }
    }
  }, [pagesResponse]);

  useEffect(() => {
    if (!isPagesFetchSuccess) {
      handleRoutingOnError(router, hasPagesFetchError, pagesFetchError);
    }
  }, [hasPagesFetchError, pagesFetchError, router]);

  const handleRemove = (record: any) => {
    handleRemovePage(record);
    refetchPages();
  };

  const columns = [
    {
      title: 'Page Name',
      dataIndex: 'pageName',
      key: 'pageName',
      fixed: 'left',
      render: (text: string, record: IPageMain) => (
        <Tooltip placement="left" title={`${text}`}>
          <a
            href={record.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 flex items-center space-x-2"
          >
            <p className="font-medium truncate w-30"> {text}</p>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Tooltip>
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
        <div className="flex gap-1 flex-wrap ">
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
      fixed: 'right',
      render: (_: any, record: IPageMain) => (
        <>
          {canEdit && uiIsSuperAdmin && (
            <>
              <ActionsButtons
                entity="page"
                handleEditButtonClick={handleEditButtonClick}
                handleRemove={handleRemove}
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
        // @ts-ignore
        columns={columns}
        scroll={{ x: 1200 }}
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
