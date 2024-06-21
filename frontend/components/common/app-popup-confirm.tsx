import React from 'react';
import { Popconfirm, message, PopconfirmProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';

type AppPopconfirmProps = {
  children: React.ReactNode;
  onDelete: (e: React.MouseEvent<HTMLElement> | undefined) => void;
  entity: string;
};

const AppPopconfirm: React.FC<AppPopconfirmProps> = ({
  children,
  onDelete,
  entity,
}) => {
  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    onDelete(e);
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    // console.log(e);
  };

  return (
    <Popconfirm
      title={`Delete the ${entity}`}
      description={`Are you sure to delete this ${entity}?`}
      onConfirm={confirm}
      onCancel={cancel}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      okText="Yes"
      cancelText="No"
    >
      {children}
    </Popconfirm>
  );
};

export default AppPopconfirm;
