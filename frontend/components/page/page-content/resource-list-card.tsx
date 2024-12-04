import React from 'react';
import { Card } from '../../ui/card';
import { IPageContentMain } from '../../../types/componentInterfaces';
import Link from 'next/link';
import usePageContent from '../../../hooks/api-hooks/use-page-content';
import ActionsButtons from '../../common/action-buttons';
import { Badge } from '../../ui/badge';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import { setCurrentUserPage } from '../../../store/slice/pageSlice';
import { EPageType } from '../../../types/enums';
import { Tooltip } from 'antd';

interface PageContentCardProps {
  pageContent?: IPageContentMain;
}

const ResourceListCard: React.FC<PageContentCardProps> = ({
  pageContent = null,
}) => {
  const {
    handlePageContentEditButtonClick,
    editingPageContent,
    handleRemovePageContent,
  } = usePageContent();

  const dispatch = useAppDispatch();
  const pageName = pageContent?.pageName ?? '';
  const href = (pageContent?.pageContentDisplayURL as string) || '';
  const pageContentName = pageContent && pageContent?.pageContentName;
  const pageContentNameTrimmed =
    pageContentName &&
    (pageContentName.length > 11
      ? pageContentName.substr(0, 11) + '...'
      : pageContentName);
  const isHidden = pageContent?.isPageContentHidden;

  interface PdfFile {
    url: string; // URL of the PDF to open
  }

  const handleRemovePage = async () => {
    await handleRemovePageContent(
      (pageContent && pageContent.pageContentId) as string
    );
  };

  return (
    <Card className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
     <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary text-white">
        <h2 className="text-2xl font-extrabold md:text-xl">
          <Link
            href={pageContent?.href as string}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Tooltip placement={'topLeft'} title={`Open: ${pageContentName}`}>
              {' '}
              <h2 className="overflow-hidden text-ellipsis whitespace-normal line-clamp-3">
                {pageContentName}
              </h2>
            </Tooltip>
          </Link>
        </h2>

        <ActionsButtons
          // href={pageContent?.href as string}
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
          handleRemove={handleRemovePage}
          record={pageContent}
          entity={pageName?.toLowerCase()}
        />
      </div>

      <div className="relative">
        <Link href={pageContent?.href as string} target="_blank">
          <img
            alt={'Page Content Display'}
            src={pageContent?.pageContentDisplayImage as string}
            className="object-cover w-full h-96 transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
        </Link>
      </div>
      <div>
        {isHidden && (
          <Badge className="w-full mt-2 bg-red-200 hover:bg-opacity-50 hover:bg-red-200 rounded-sm bg-opacity-50 text-red-600 px-4 py-1 text-xs shadow-md">
            {'This post is hidden from users'}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default ResourceListCard;
