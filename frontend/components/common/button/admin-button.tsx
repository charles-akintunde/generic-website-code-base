import React, { ElementType } from 'react';
import AppButton from './app-button';
import { IButton } from '@/types/componentInterfaces';

export interface IAdminButton {
  isRightPosition?: boolean;
  Icon?: ElementType;
  href?: string;
  buttonText: string;
  onClick?: () => void | Promise<void>;
  classNames?: string;
  hasAccess: boolean;
}

const AdminButton: React.FC<IAdminButton> = ({
  isRightPosition,
  Icon,
  href,
  buttonText,
  onClick,
  classNames,
  hasAccess,
}) => {
  if (!hasAccess) {
    return <></>;
  }
  return (
    <AppButton
      isRightPosition={isRightPosition}
      Icon={Icon}
      href={href}
      buttonText={buttonText}
      onClick={onClick}
      classNames={classNames}
    />
  );
};

export default AdminButton;
