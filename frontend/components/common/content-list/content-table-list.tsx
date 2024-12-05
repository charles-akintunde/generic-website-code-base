import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { usePathname } from 'next/navigation';
import { useGetPageWithPaginationQuery } from '../../../api/pageContentApi';
import { handleRoutingOnError, normalizeMultiContentPage } from '../../../utils/helper';
import { addPageContents, setPageContents, setFecthingPageData, setCurrentUserPage } from '../../../store/slice/pageSlice';
import AppLoading from '../app-loading';
import { IFetchedPage, IPageContentMain } from '../../../types/componentInterfaces';
import { RootState } from '../../../types/componentInterfaces';
import ResourceListTable from '../../page/page-content/resource-table-list';
import { CreatePageContentModal } from '../form/create-page-content';
import { containerNoFlexPaddingStyles } from '../../../styles/globals';
import { TablePaginationConfig } from 'antd';

interface ContentListProps {
  pageDisplayURL: string;
  pageId: string,
  pageName: string,
  pageType: string,
 
}

export interface IPageConfig {
  currentPage: number,
  pageOffSet: number
   
  }

const ContentTableList: React.FC<ContentListProps> = ({pageDisplayURL, pageId,pageName, pageType}) => {
  const dispatch = useAppDispatch();
  const [pageContents, setPageContents] = useState< IPageContentMain[]>([]);
  const [totalPageContents, setTotalPageContents] = useState<number>();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const [currentPageConfig, setCurrentPageConfig] = useState<IPageConfig>({
    currentPage: 1,
    pageOffSet: 10
  });

  console.log(currentPageConfig, "currentPageConfig")
  

  const { data: pageContentsData, isLoading: isPageContentFetchLoading } =
    useGetPageWithPaginationQuery(
      {
        PG_DisplayURL: pageDisplayURL ?? '',
        PG_PageNumber: currentPageConfig.currentPage, 
        PG_PageOffset: currentPageConfig.pageOffSet
      },
      {
        skip: !pageDisplayURL,
        refetchOnMountOrArgChange: true,
      }
    );
    const handleTableChange = (pagination: TablePaginationConfig) => {
      const { current, pageSize } = pagination;
    
      setCurrentPageConfig((prev) => ({
        ...prev,
        currentPage: current || prev.currentPage,
        pageOffSet: pageSize || prev.pageOffSet,
      }));
    };

    const openCreateContentModal = () => {
        dispatch(
          setCurrentUserPage({
            isModalOpen: true,
            pageId: pageId,
            pageName: pageName,
            pageType: pageType,
            isEditingMode: false,
          })
        );
      };

  useEffect(() => {
    if (!pageContentsData) return;

    const responseData = pageContentsData.data;
    const dynamicPage = normalizeMultiContentPage(responseData, false);
    setPageContents(dynamicPage?.pageContents as IPageContentMain[])
    setTotalPageContents(dynamicPage.totalPageContents as number)


  }, [pageContentsData, dispatch, isPageContentFetchLoading]);

  if (isPageContentFetchLoading) {
    return <AppLoading />;
  }

  return (
    <div className="">
        <div className={`${containerNoFlexPaddingStyles} pt-8`}>
    <header className="flex justify-between items-center pb-4">
      <h2 className="text-xl font-bold">Latest Content</h2>
      {canEdit && (
         <CreatePageContentModal
         onClick={openCreateContentModal}
         pageType={pageType}
         pageId={pageId}
       />
      )}
    </header>
    <ResourceListTable totalPageContents={totalPageContents as number}  currentPageConfig={currentPageConfig} onPageChange={handleTableChange} pageContents={pageContents} />
  </div>
  </div>
  );
};

export default ContentTableList;
