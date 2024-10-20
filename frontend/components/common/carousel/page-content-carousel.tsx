'use client';
import React from 'react';
import usePage from '../../../hooks/api-hooks/use-page';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { IPageContentMain } from '../../../types/componentInterfaces';
import { formatDate } from '../../../utils/helper';
import Link from 'next/link';
import { Empty } from 'antd';
import { Tooltip } from 'antd';
import { appConfig } from '../../../utils/appConfig';

interface IPageContent {
  pageContentId: string;
  pageContentName: string;
  pageContentDisplayImage: string;
  editorContent: any;
}

interface IPageContentCarouselCardProps {
  pageContent: IPageContentMain;
}

const PageContentCarouselCard: React.FC<IPageContentCarouselCardProps> = ({
  pageContent,
}) => {
  const date = formatDate(pageContent.pageContentCreatedAt as string);
  return (
    <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300">
      <Link href={pageContent.href}>
        <img
          className="w-full h-48 object-cover rounded-md transition-opacity duration-300 hover:opacity-90"
          src={pageContent.pageContentDisplayImage as string}
          alt={pageContent.pageContentName}
        />
      </Link>

      <Tooltip
        placement="topLeft"
        title={`Read: ${pageContent.pageContentName}`}
      >
        <div className="mt-4">
          <Link href={pageContent.href}>
            <h2 className="text-lg font-semibold transition-colors duration-300 hover:text-blue-500 overflow-hidden text-ellipsis whitespace-nowrap">
              {pageContent.pageContentName}
            </h2>
          </Link>
        </div>
      </Tooltip>

      <div className="mt-2 h-20 text-sm text-gray-700 overflow-hidden text-ellipsis">
        {pageContent.pageContentExcerpt}{' '}
      </div>

      <Link href={pageContent.href}>
        <span className="text-blue-500 text-sm mt-2 block hover:opacity-70 transition-opacity duration-300">
          Read More
        </span>
      </Link>

      <div className=" text-sm text-gray-500 mt-4">
        <span>{date}</span> |
        <span> {pageContent.pageContentReadingTime} min read</span>
      </div>
    </div>
  );
};

const PageContentCarousel: React.FC = () => {
  const pageDisplayURL = appConfig.urlForPageToDisplayOnHome;
  const { pageContents } = usePage({ pageDisplayURL });
  // const fetchingPageData = useAppSelector(
  //   (state) => state.page.fetchingPageData
  // ) as IFetchedPage;

  const fetchedPageContents: IPageContentMain[] = pageContents;

  if (!fetchedPageContents || fetchedPageContents.length === 0) {
    return (
      <Empty
        description="No content available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 1,
          containScroll: 'trimSnaps',
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="flex pb-12 w-full">
          {fetchedPageContents.map((pageContent) => (
            <CarouselItem
              key={pageContent.pageContentId}
              className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 lg:basis-1/3 md:basis-1/2 basis-3/3"
            >
              <PageContentCarouselCard pageContent={pageContent} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2" />
      </Carousel>
    </div>
  );
};

export default PageContentCarousel;
