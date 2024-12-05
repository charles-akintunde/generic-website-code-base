import React from 'react';
import { Table, Tooltip, Badge, TablePaginationConfig } from 'antd';
import { IPageContentMain } from '../../../types/componentInterfaces';
import usePageContent from '../../../hooks/api-hooks/use-page-content';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { setCurrentUserPage } from '../../../store/slice/pageSlice';
import { EPageType } from '../../../types/enums';
import ActionsButtons from '../../common/action-buttons';
import { DownloadIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { FileIcon } from 'lucide-react';
import { IPageConfig } from '../../common/content-list/content-table-list';

interface PageContentTableProps {
  pageContents: IPageContentMain[]; 
  currentPageConfig: IPageConfig;
  onPageChange:(pagination: TablePaginationConfig) => void;
  totalPageContents: number
}

const ResourceListTable: React.FC<PageContentTableProps> = ({
  pageContents = [],
  onPageChange,
  currentPageConfig,
  totalPageContents
}) => {
  const {
    handlePageContentEditButtonClick,
    handleRemovePageContent,
  } = usePageContent();

  const dispatch = useAppDispatch();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;


  const handleRemove =async (record: IPageContentMain) => {
    await handleRemovePageContent(record.pageContentId as string)

  };

  interface tableDataProp  {
    key: number;
    pageContentName: string,
    pageName:string,
    isPageContentHidden: boolean,
    pageContentId: number,
    href: number,
    id: number
  }
  const shouldShowActions = canEdit; 

  const columns = [
    {
      title: 'Page Content Name',
      dataIndex: 'pageContentName',
      width: 300,
      key: 'pageContentName',
      render: (text: string) => (
       
          <div className="flex items-center space-x-2">
            <FileIcon  className="text-gray-600 w-4 h-4" /> 
            <span className="block truncate overflow-hidden whitespace-nowrap max-w-full">
              {text}
            </span>
          </div>
      
      ),
    },
    {
      title: 'Hidden Status',
      dataIndex: 'isPageContentHidden',
      key: 'isPageContentHidden',
      render: (isHidden: boolean) =>
        isHidden ? (
          <Badge className="mr-2 mb-2 text-xs lg:mr-4 lg:mb-0 rounded-lg bg-red-100 bg-opacity-50 text-red-400 px-2 py-1 hover:bg-red-100 hover:bg-opacity-50">
          
            Hidden
          </Badge>
        ) : (
          <Badge className="mr-2 mb-2 lg:mr-4 text-xs rounded-md lg:mb-0 bg-blue-100 bg-opacity-50 text-blue-400 px-2 py-1 hover:bg-blue-100 hover:bg-opacity-50">
            Visible
          </Badge>
        ),
    },
 
    {
      title: 'Download',
      key: 'download',
      render: (_: any, record: IPageContentMain) => (
           <Link
            href={record?.href ? record?.href : ''} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
          >
            <DownloadIcon className="w-4 h-4 text-primary" />
          </Button>
        </Link>
      ),
    },
    shouldShowActions && {
      title: 'Actions',
      key: 'actions',
      render: (_: any, pageContent: IPageContentMain) => (
        <ActionsButtons
          handleEditButtonClick={() => {
            dispatch(
              setCurrentUserPage({
                isModalOpen: true,
                isEditingMode: true,
                pageContent: pageContent,
                pageType: EPageType.ResList,
              })
            );
          }}
          handleRemove={handleRemove}
          record={pageContent}
          entity={pageContent?.pageContentName?.toLowerCase()}
        />
      ),
    },
  ].filter(Boolean); 
  


  const tableData = pageContents.map((content, index) => ({
    key: index,
    pageContentName: content.pageContentName ?? '',
    pageName: content.pageName ?? '',
    isPageContentHidden: content.isPageContentHidden,
    pageContentId: content.pageContentId,
    href: content.href,
  }));


  console.log(tableData,"tableData")
  return (
    <section className="bg-gray-100 rounded-lg shadow-sm p-4 mt-4">
    <Table
    //@ts-ignore
      columns={columns}  
      //@ts-ignore
      dataSource={tableData}
      onChange={onPageChange}
      pagination={{
        current: currentPageConfig.currentPage,
        pageSize: currentPageConfig.pageOffSet,
     
        total: totalPageContents,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30'],
      }}
      

    />
    </section>
  );
};

export default ResourceListTable;


