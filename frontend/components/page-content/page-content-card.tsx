import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import authImg from '@/assets/images/auth-image.webp';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '../ui/button';
import AppPopconfirm from '../common/app-popup-confirm';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
  IPageContentItem,
  IPageContentMain,
} from '@/types/componentInterfaces';
import ActionsButtons from '../common/action-buttons';
import usePage from '@/hooks/api-hooks/use-page';
import usePageContent from '@/hooks/api-hooks/use-page-content';

interface IPageContentCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageSrc: string | File;
  date: string;
  readTime: string;
  href: string;
  category: string;
  pageName: string;
  pageContent: IPageContentMain;
}

const PageContentCard: React.FC<IPageContentCardProps> = (props) => {
  const {
    handlePageContentEditButtonClick,
    editingPageContent,
    handleRemovePageContent,
  } = usePageContent();
  const handleEditButtonClick = () => {
    handlePageContentEditButtonClick(props.pageContent);
  };
  console.log(editingPageContent, 'editingPageContent');
  const handleRemovePage = async () => {
    await handleRemovePageContent(props.id);
  };
  const first25Words = props.excerpt.split(' ').slice(0, 25).join(' ');
  return (
    <Card className="bg-white">
      <CardHeader>
        <Link onClick={handleEditButtonClick} href={props.href}>
          <img
            src={props.imageSrc as string}
            alt="Article"
            className="w-full h-52 rounded-t-sm object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent>
        <Badge className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-blue-200 rounded-sm bg-opacity-50 text-blue-400 px-6 py-1 hover:bg-blue-100 hover:bg-opacity-50">
          {props.category}
        </Badge>
        <CardTitle className="text-xl font-bold mt-2">
          <Link onClick={handleEditButtonClick} href={props.href}>
            {props.title}
          </Link>
        </CardTitle>
        <p className="mt-2 text-md text-gray-600 line-clamp-3">
          {props.excerpt}
        </p>
        <Link onClick={handleEditButtonClick} href={props.href}>
          <span className="text-blue-500 text-sm hover:underline">
            Read more
          </span>
        </Link>
      </CardContent>

      <CardFooter className="flex justify-between bottom-3">
        <div className="text-sm text-gray-500">
          {props.date} | {props.readTime}
        </div>
        <ActionsButtons
          entity={`${props.pageName} content`}
          record={props}
          handleEditButtonClick={handleEditButtonClick}
          handleRemove={handleRemovePage}
        />
      </CardFooter>
    </Card>
  );
};

export default PageContentCard;
