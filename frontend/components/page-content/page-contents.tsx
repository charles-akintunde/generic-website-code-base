import React from 'react';
import PageContentCard from './page-content-card';
import { toKebabCase } from '@/utils/helper';
import AppButton from '../common/button/app-button';
import { PlusIcon } from 'lucide-react';
import { primarySolidButtonStyles } from '@/styles/globals';

const dummyData = [
  {
    title: 'Duis aute irure dolor lorem aute irure ipsum',
    excerpt:
      'Nam libero tempore, cum soluta nobis est eligendi optio sssssss  ssssss sssss sssssssss  sssssssssssssssssss   xxxxxxxxxxxxxxxxxxxxxxx   sssss cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
    imageSrc: '/path-to-image.jpg',
    date: 'December 10, 2021',
    readTime: '5 min read',
    href: '/articles/1',
    category: 'Support',
  },
  {
    title: 'Another article title',
    excerpt: 'Short excerpt for the article goes here.',
    imageSrc: '/path-to-another-image.jpg',
    date: 'December 12, 2021',
    readTime: '4 min read',
    href: '/articles/2',
    category: 'Marketing',
  },
  // Add more dummy articles as needed
];

const PageContents = () => {
  return (
    <div className="">
      <header className="flex justify-between items-center py-4">
        <h2 className="text-xl font-bold">Latest Events</h2>
        <AppButton
          buttonText="Create Page Content"
          Icon={PlusIcon}
          href="/events/create-page-content"
          classNames={primarySolidButtonStyles}
        />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dummyData.map((article, index) => (
          <PageContentCard
            key={index}
            title={article.title}
            excerpt={article.excerpt}
            imageSrc={article.imageSrc}
            date={article.date}
            readTime={article.readTime}
            href={`events/${toKebabCase(article.title)}`}
            category={article.category}
          />
        ))}
      </div>
    </div>
  );
};

export default PageContents;
