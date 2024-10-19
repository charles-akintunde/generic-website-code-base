import React from 'react';
import { Button } from '../../ui/button';
import { LoadingOutlined } from '@ant-design/icons';
import { ILoadingButton } from '../../../types/componentInterfaces';

const LoadingButton: React.FC<ILoadingButton> = ({
  buttonText,
  loading,
  className = '',
  type = 'submit',
  onClick = () => {},
}) => {
  return (
    <Button
      type={type}
      className={`${className} w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center`}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <LoadingOutlined className="animate-spin" /> : `${buttonText}`}
    </Button>
  );
};

export default LoadingButton;
