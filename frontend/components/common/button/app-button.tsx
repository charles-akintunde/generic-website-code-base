import React from 'react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { IButton } from '@/types/componentInterfaces';

const AppButton: React.FC<IButton> = ({
  isRightPosition,
  Icon,
  href,
  buttonText,
  onClick,
  classNames,
  variant,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant ? variant : 'outline'}
      className={classNames}
      asChild
    >
      <Link href={href ? href : ''}>
        {!isRightPosition && Icon && <Icon className="mr-2 h-4 w-4" />}{' '}
        {buttonText}{' '}
        {isRightPosition && Icon && <Icon className="ml-2 h-4 w-4" />}
      </Link>
    </Button>
  );
};

export default AppButton;
