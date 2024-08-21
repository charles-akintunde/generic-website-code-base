import React from 'react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { IButton } from '@/types/componentInterfaces';
const SolidButton: React.FC<IButton> = ({
  isRightPosition,
  Icon,
  href,
  buttonText,
  onClick,
  classNames,
}) => {
  return (
    <Button onClick={onClick} className={classNames} asChild>
      <Link href={href ? href : ''}>
        {!isRightPosition && Icon && <Icon className="mr-2 h-5 w-5" />}{' '}
        {buttonText}{' '}
        {isRightPosition && Icon && <Icon className="ml-2 h-5 w-5" />}
      </Link>
    </Button>
  );
};

export default SolidButton;
