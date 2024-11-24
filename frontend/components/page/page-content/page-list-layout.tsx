import React, { ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { IPageContentMain } from '../../../types/componentInterfaces';
import { estimateReadingTime, formatDate } from '../../../utils/helper';
import { containerNoFlexPaddingStyles, pageContentPaddingStyles } from '../../../styles/globals';
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
    <div className="bg-pg ">
      <div className={`${containerNoFlexPaddingStyles} p-10`}>
      <div
        className={`${containerNoFlexPaddingStyles} shadow-md  rounded-sm bg-white`}
      >
        <header>
          <h1 className="text-3xl pt-10 font-bold mb-2">{contentName}</h1>
          {pageType != EPageType.ResList && (
            <div className="flex items-center mb-4">
              {/* <Avatar size="large" icon={<UserOutlined />} /> */}
              <div className="">
               <div className="font-medium"> {'Posted by'} {creatorFullName}</div>
                <div className="text-gray-500 text-sm">
                 {'on'} {createdAt} ({estimatedReadTime} min{estimatedReadTime > 1 ? 's' : ''} read)
                  
                </div>
              </div>
            </div>
          )}
        </header>
        <Divider />
        <div className='mt-8'>{children}</div>
      </div>

      </div>
     
      <FloatButton.BackTop visibilityHeight={400} />
    </div>
  );
};

export default PageListLayout;
