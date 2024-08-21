import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const AppLoading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-pg">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} />
    </div>
  );
};

export default AppLoading;
