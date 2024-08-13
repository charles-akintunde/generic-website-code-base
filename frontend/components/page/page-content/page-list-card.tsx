import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { IPageContentMain } from '@/types/componentInterfaces';
import ActionsButtons from '@/components/common/action-buttons';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import {
  estimateReadingTime,
  formatDate,
  getPageExcerpt,
} from '@/utils/helper';

interface IPageContentCardProps {
  pageName: string;
  pageContent: IPageContentMain;
}

const PageListCard: React.FC<IPageContentCardProps> = ({
  pageName,
  pageContent,
}) => {
  const { handlePageContentEditButtonClick, handleRemovePageContent } =
    usePageContent();
  const handleEditButtonClick = () => {
    handlePageContentEditButtonClick(pageContent);
  };
  const title = pageContent.pageContentName;
  const excerpt = getPageExcerpt(pageContent.editorContent);
  const imageSrc = pageContent.pageContentDisplayImage;
  const readTime = `${estimateReadingTime(pageContent.editorContent)} mins Read`;
  const date = formatDate(pageContent.pageContentCreatedAt as string);
  const href = pageContent.href;
  const category = pageName;
  const isHidden = pageContent.isPageContentHidden;

  const handleRemovePage = async () => {
    await handleRemovePageContent(pageContent.pageContentId);
  };

  return (
    <Card className="bg-white flex flex-col h-full transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <Link onClick={handleEditButtonClick} href={href}>
          <img
            src={imageSrc as string}
            alt="Article"
            className="w-full h-72 rounded-t-sm object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap">
          <Badge className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-blue-200 rounded-sm bg-opacity-50 text-blue-400 px-6 py-1 hover:bg-blue-200 hover:bg-opacity-50 shadow-sm">
            {category}
          </Badge>
          {isHidden && (
            <Badge className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-red-200 rounded-sm bg-opacity-50 text-red-600 px-6 py-1 hover:bg-red-200 hover:bg-opacity-50 shadow-sm">
              {'This post is hidden from users'}
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl font-bold mt-2">
          <Link onClick={handleEditButtonClick} href={href}>
            {title}
          </Link>
        </CardTitle>
        <p className="mt-2 text-md text-gray-600 line-clamp-3">{excerpt}</p>
        <Link onClick={handleEditButtonClick} href={href}>
          <span className="text-blue-500 text-sm hover:underline">
            Read more
          </span>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto bottom-3">
        <div className="text-sm text-gray-500">
          {date} | {readTime}
        </div>
        <ActionsButtons
          href={href}
          entity={`${pageName} content`}
          record={pageContent}
          handleEditButtonClick={handleEditButtonClick}
          handleRemove={handleRemovePage}
        />
      </CardFooter>
    </Card>
  );
};

export default PageListCard;
