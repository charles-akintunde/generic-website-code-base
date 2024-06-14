import React from 'react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { IButton } from '@/types/componentInterfaces';
const SolidButton: React.FC<IButton> = ({
  isRightPosition,
  Icon,
  href,
  buttonText,
}) => {
  return (
    <Button
      variant="outline"
      className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:text-white font-medium py-2 px-4  rounded-md transition duration-200 ease-in-out flex items-center"
      asChild
    >
      <Link href={href}>
        {!isRightPosition && <Icon className="mr-2 h-5 w-5" />} {buttonText}{' '}
        {isRightPosition && <Icon className="ml-2 h-5 w-5" />}
      </Link>
    </Button>
  );
};

export default SolidButton;
