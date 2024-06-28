import React from 'react';
import PageContentCard from './page-content-card';
import { fromKebabCase, toKebabCase } from '@/utils/helper';
import AppButton from '../common/button/app-button';
import { PlusIcon } from 'lucide-react';
import {
  containerNoFlexPaddingStyles,
  primarySolidButtonStyles,
} from '@/styles/globals';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';
import { TElement } from '@udecode/plate-common';

interface PageContentProps {
  page: IPageMain | null;
}

const getPageExcerpt = (contents: TElement[]) => {
  let excerpt = '';
  for (let content of contents) {
    if (content.type === 'p') {
      for (let child of content.children) {
        excerpt += excerpt + child.text;
      }
      break;
    }
  }
  return excerpt;
};

function countWords(text: string) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

// Function to estimate reading time
function estimateReadingTime(pageContents: TElement[]) {
  let totalWords = 0;
  let imageCount = 0;

  // Traverse through the page contents
  pageContents.forEach((content) => {
    if (content.type === 'p') {
      // Assuming each child in <p> is a text node
      content.children.forEach((child) => {
        let text: string = child.text ?? '';
        totalWords += countWords(text);
      });
    } else if (content.type === 'img') {
      imageCount += content.children.length;
    }
  });

  // Calculate reading time
  const readingSpeed = 200; // words per minute
  const imageReadingTime = 5; // seconds per image

  const readingTimeMinutes = totalWords / readingSpeed;
  const imageTimeMinutes = (imageCount * imageReadingTime) / 60;

  const totalReadingTimeMinutes = readingTimeMinutes + imageTimeMinutes;

  return totalReadingTimeMinutes.toFixed(2); // Return in minutes
}

const PageContents: React.FC<PageContentProps> = ({ page }) => {
  console.log(page, 'PAGE');
  const pageName = toKebabCase(page?.pageName ?? '');
  const pageId = page?.pageId ?? '';
  const pageContents: IPageContentMain[] =
    (page?.pageContents as IPageContentMain[]) ?? [];
  const queryParams = {
    pageName: pageName,
    pageId: pageId,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  return (
    <div className={`${containerNoFlexPaddingStyles} pt-8`}>
      <header className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-bold">Latest {page?.pageName}</h2>
        <AppButton
          buttonText={`Create ${pageName}`}
          Icon={PlusIcon}
          href={`/${pageName}/create-page-content?${queryString}`}
          classNames={primarySolidButtonStyles}
        />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pageContents &&
          pageContents.map((pageContent, index) => (
            <PageContentCard
              pageContent={pageContent}
              pageName={`${page?.pageName.toLowerCase() ?? ''}`}
              key={index}
              id={pageContent.pageContentId}
              title={pageContent.pageContentName}
              excerpt={getPageExcerpt(pageContent.pageContents)}
              imageSrc={pageContent.pageContentDisplayImage}
              date={'5 min read'}
              readTime={'December 10, 2021'}
              href={pageContent.href}
              category={`${page && page.pageName}`}
            />
          ))}
      </div>
    </div>
  );
};

export default PageContents;
