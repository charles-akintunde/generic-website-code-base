import React from 'react';
import { Avatar, Card, Button } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { IPageContentMain } from '@/types/componentInterfaces';
import Link from 'next/link';

const { Meta } = Card;

interface PageContentCardProps {
  pageContent?: IPageContentMain;
}

const ResourceListCard: React.FC<PageContentCardProps> = ({
  pageContent = null,
}) => {
  const handleEditButtonClick = () => {
    //  handlePageContentEditButtonClick(pageContent);
  };

  const handleRemovePage = async () => {
    //await handleRemovePageContent(pageContent.pageContentId);
  };

  console.log(
    pageContent && pageContent.pageContentResource,
    '(pageContent && pageContent.pageContentResource)'
  );

  return (
    <Card
      style={{ width: 300 }}
      hoverable
      cover={
        <Link href={''}>
          <img
            alt="Page Content Display"
            src={
              ((pageContent &&
                pageContent.pageContentDisplayImage) as string) ||
              'default-image-url.jpg'
            }
            className="object-cover h-60"
          />
        </Link>
      }
      actions={[<EditOutlined />, <EllipsisOutlined />]}
    >
      <Meta title={`${pageContent && pageContent?.pageContentName}`} />
    </Card>
  );
};

export default ResourceListCard;
