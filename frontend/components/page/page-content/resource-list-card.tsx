import React from 'react';
import { Card } from '@/components/ui/card';
import { IPageContentMain } from '@/types/componentInterfaces';
import Link from 'next/link';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import ActionsButtons from '@/components/common/action-buttons';
import { Badge } from '@/components/ui/badge';

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
  const pageName = pageContent?.pageName ?? '';
  const href = (pageContent?.pageContentResource as string) || '';
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
  console.log(pageContent, '(pageContent && pageContent.pageContentResource)');

  return (
    <Card className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
        <h2 className="text-2xl font-extrabold md:text-xl">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <span className="font-medium">{pageContentName}</span>
          </a>
        </h2>
        <ActionsButtons
          href={pageContent?.href as string}
          handleEditButtonClick={() => {}}
          handleRemove={handleRemovePage}
          record={pageContent}
          entity={pageName?.toLowerCase()}
        />
      </div>

      <div className="relative">
        <Link href={href} target="_blank">
          <img
            alt={'Page Content Display'}
            src={pageContent?.pageContentDisplayImage as string}
            className="object-cover w-full h-96 transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
        </Link>
      </div>
      {isHidden && (
        <Badge className="absolute mt-2 bg-red-200 hover:bg-opacity-50 hover:bg-red-200 rounded-sm bg-opacity-50 text-red-600 px-4 py-1 text-xs shadow-md">
          {'This post is hidden from users'}
        </Badge>
      )}
    </Card>
  );
};

export default ResourceListCard;
