import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { IPageContentMain } from '@/types/componentInterfaces';
import Link from 'next/link';
import { toKebabCase } from '@/utils/helper';
import AppPopconfirm from '../common/app-popup-confirm';

import axios from 'axios';
import usePageContent from '@/hooks/api-hooks/use-page-content';
import { Link2Icon } from 'lucide-react';
import ActionsButtons from '../common/action-buttons';
const { Meta } = Card;

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

  interface PdfFile {
    url: string; // URL of the PDF to open
  }

  const handleRemovePage = async () => {
    await handleRemovePageContent(
      (pageContent && pageContent.pageContentId) as string
    );
  };

  // const openPdfSecurely = async (
  //   e: React.MouseEvent<HTMLAnchorElement>,
  //   file: PdfFile
  // ) => {
  //   e.preventDefault(); // Prevent default link behavior

  //   const pdfUrl = file.url;

  //   try {
  //     const response = await axios.get(pdfUrl, {
  //       responseType: 'blob', // Expect binary response (PDF)
  //     });

  //     if (response.status !== 200) {
  //       throw new Error(`Error fetching PDF: Status code ${response.status}`);
  //     }

  //     const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  //     const url = URL.createObjectURL(pdfBlob);

  //     // Option 1: Open in a new tab (recommended for increased security)
  //     window.open(url, '_blank');

  //     // Option 2: Open in the current tab (less secure, use with caution)
  //     // window.open(url, '_self');

  //     // Optionally, revoke the object URL after use to prevent memory leaks
  //     // setTimeout(() => URL.revokeObjectURL(url), 5000); // Example with 5 seconds delay
  //   } catch (error) {
  //     console.error('Error opening PDF:', error);
  //   }
  // };

  console.log(pageContent, '(pageContent && pageContent.pageContentResource)');

  return (
    <Card className="rounded-lg shadow-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-400 to-indigo-500



 text-white"
      >
        <h2 className="text-xl font-extrabold md:text-md">
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

      <div>
        <Link href={href} target="_blank">
          <img
            alt="Page Content Display"
            src={
              ((pageContent &&
                pageContent.pageContentDisplayImage) as string) ||
              'default-image-url.jpg'
            }
            className="object-cover w-full h-96 transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
        </Link>
      </div>
    </Card>
  );
};

export default ResourceListCard;
