import React from 'react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { IButton } from '@/types/componentInterfaces';

const OutlinedButton: React.FC<IButton> = ({
  isRightPosition,
  Icon,
  href,
  buttonText,
}) => {
  return (
    <Button
      variant="outline"
      className="border border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
      asChild
    >
      <Link href={href}>
        {!isRightPosition && <Icon className="mr-2 h-5 w-5" />} {buttonText}{' '}
        {isRightPosition && <Icon className="ml-2 h-5 w-5" />}
      </Link>
    </Button>
  );
};

export default OutlinedButton;
