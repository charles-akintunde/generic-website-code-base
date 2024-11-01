import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Badge } from '../../ui/badge';
import Link from 'next/link';
import { IPageContentMain } from '../../../types/componentInterfaces';
import ActionsButtons from '../../common/action-buttons';
import usePageContent from '../../../hooks/api-hooks/use-page-content';
import {
  formatDate,
  isScheduledDateGreaterThanCurrent,
} from '../../../utils/helper';
import { EyeOff, Clock } from 'lucide-react';
import { Tooltip } from 'antd';

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
  //const excerpt = getPageExcerpt(pageContent.editorContent);
  const excerpt = pageContent.pageContentExcerpt;
  const imageSrc = pageContent.pageContentDisplayImage;
  const readTime = `${pageContent.pageContentReadingTime} mins Read`;
  const date = formatDate(pageContent.pageContentCreatedAt as string);
  const isScheduled =
    pageContent.pageContentCreatedAt &&
    isScheduledDateGreaterThanCurrent(
      pageContent.pageContentCreatedAt as string
    );
  const href = pageContent.href;
  //const category = pageName;
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
        <div className="flex flex-wrap space-x-2">
          {isHidden && (
            <Tooltip placement={'top'} title={`Hidden Post`}>
              <div className="p-1 border bg-opacity-50 cursor-pointer border-gray-300 rounded-md ">
                <EyeOff className="h-4 w-4 text-gray-500" />
              </div>
            </Tooltip>
          )}
          {isScheduled && (
            <Tooltip placement={'top'} title={`Scheduled Post`}>
              <div className="p-1 border bg-opacity-50  cursor-pointer border-gray-300 rounded-md ">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
            </Tooltip>
          )}
        </div>

        <CardTitle className="text-xl font-bold mt-2">
          <Link onClick={handleEditButtonClick} href={href}>
            <Tooltip placement={'topLeft'} title={`Read: ${title}`}>
              {' '}
              <h2 className="overflow-hidden text-ellipsis whitespace-normal line-clamp-3">
                {title}
              </h2>
            </Tooltip>
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
