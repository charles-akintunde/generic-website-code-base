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

interface IPageContentCard {
  title: string;
  excerpt: string;
  imageSrc: string;
  date: string;
  readTime: string;
  href: string;
  category: string;
}

const PageContentCard: React.FC<IPageContentCard> = ({
  title,
  excerpt,
  imageSrc,
  date,
  readTime,
  href,
  category,
}) => {
  const first25Words = excerpt.split(' ').slice(0, 25).join(' ');
  return (
    <Card className="bg-white">
      <CardHeader>
        <Link href={href}>
          <Image
            src={authImg}
            alt="Article"
            className="w-full h-52 rounded-t-sm object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent>
        <Badge className="mr-2 mb-2 lg:mr-4 lg:mb-0 bg-blue-200 rounded-sm bg-opacity-50 text-blue-400 px-6 py-1 hover:bg-blue-100 hover:bg-opacity-50">
          {category}
        </Badge>
        <CardTitle className="text-xl font-bold mt-2">
          <Link href={href}>{title}</Link>
        </CardTitle>
        <p className="mt-2 text-md text-gray-600 line-clamp-3">{excerpt}</p>
        <Link href={href}>
          <span className="text-blue-500 text-sm hover:underline">
            Read more
          </span>
        </Link>
      </CardContent>

      <CardFooter className="bottom-3">
        <div className="text-sm text-gray-500">
          {date} | {readTime}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PageContentCard;
