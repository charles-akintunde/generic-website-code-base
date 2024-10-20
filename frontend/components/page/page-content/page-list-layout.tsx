import React, { ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { IPageContentMain } from '../../../types/componentInterfaces';
import { estimateReadingTime, formatDate } from '../../../utils/helper';
import { pageContentPaddingStyles } from '../../../styles/globals';
import { EPageType } from '../../../types/enums';
import { FloatButton } from 'antd';
import { Divider } from 'antd';
import UploadPageContentImage from '../../common/upload-page-content-image';
interface PageListLayoutProps {
  children: ReactNode;
  pageContent: IPageContentMain;
}

const PageListLayout: React.FC<PageListLayoutProps> = ({
  pageContent,
  children,
}) => {
  const contentName = String(pageContent && pageContent.pageContentName);
  const createdAt = formatDate(
    pageContent && (pageContent.pageContentCreatedAt as string)
  );
  const estimatedReadTime = estimateReadingTime(
    pageContent && pageContent.editorContent
      ? pageContent.editorContent
      : [
          {
            id: '1',
            type: 'p',
            children: [{ text: 'Hello, World!' }],
          },
        ]
  );
  const creatorFullName = pageContent && pageContent.creatorFullName;
  const pageType = pageContent && pageContent.pageType;

  return (
    <div className="">
      <header className={`${pageContentPaddingStyles} mt-10`}>
        <h1 className="text-3xl font-bold mb-2">{contentName}</h1>
        {pageType != EPageType.ResList && (
          <div className="flex items-center mb-4">
            {/* <Avatar size="large" icon={<UserOutlined />} /> */}
            <div className="ml-3">
              <div className="font-medium">{creatorFullName}</div>
              <div className="text-gray-500 text-sm">
                {estimatedReadTime} min{estimatedReadTime > 1 ? 's' : ''} read ·{' '}
                {createdAt}
              </div>
            </div>
          </div>
        )}
      </header>
      <Divider />
      <div>{children}</div>

      <FloatButton.BackTop visibilityHeight={400} />
    </div>
  );
};

export default PageListLayout;
