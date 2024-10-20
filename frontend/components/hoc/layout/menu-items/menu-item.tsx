'use client';
import React, { useEffect, useState } from 'react';
import { IPageMenuItem } from '../../../../types/componentInterfaces';
import Link from 'next/link';
import cx from 'classnames';
import { usePathname } from 'next/navigation';
import { closeDrawer } from '../../../../store/slice/layoutSlice';
import { useAppDispatch } from '../../../../hooks/redux-hooks';
import { ChevronDown } from 'lucide-react';

interface MenuItemComponentProps {
  href: string;
  pageName: string;
  hasChildren: boolean;
}

const MenuItem: React.FC<IPageMenuItem> = ({ pageName, href, isHidden }) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(closeDrawer());
  };

  return (
    <Link
      href={href as string}
      passHref
      onClick={handleClose}
      className={cx(
        'text-xs cursor-pointer pl-6 p-4 transition-all duration-300 ease-in-out lg:hover:bg-transparent hover:text-primary break-words md:hover:bg-blue-500 md:hover:bg-opacity-20 text-ellipsis overflow-hidden whitespace-nowrap lg:hover:bg-opacity-50 lg:hover:rounded-sm lg:hover:bg-gray-100 lg:whitespace-normal',
        {
          hidden: isHidden,
          'text-primary md:bg-blue-500 md:bg-opacity-20 lg:bg-transparent md:border-r-2  lg:border-0 md:border-primary xs:hover:bg-blue-500 xs:hover:bg-opacity-20':
            isActive,
        }
      )}
    >
      <nav className="text-xs whitespace-nowrap">{pageName}</nav>
    </Link>
  );
};

export default MenuItem;

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  href,
  pageName,
  hasChildren,
}) => (
  <>
    {href ? (
      <Link href={href}>
        <div
          className={`flex items-center justify-between space-x-2 transition cursor-pointer duration-300 ease-in-out hover:text-primary transform hover:bg-opacity-50 hover:bg-gray-100 rounded-md px-4`}
        >
          <p>{pageName}</p>
          {hasChildren && (
            <span className="ml-2  flex-end transform transition-transform duration-300 ease-in-out group-hover:rotate-180">
              <ChevronDown className="h-3 w-3" />
            </span>
          )}
        </div>
      </Link>
    ) : (
      <div
        className={`flex justify-between items-center cursor-pointer duration-300 ease-in-out hover:text-primary transform hover:bg-opacity-50 hover:bg-gray-100 rounded-md px-4`}
      >
        <p>{pageName}</p>
        {hasChildren && (
          <span className="ml-2 transform transition-transform duration-300 ease-in-out group-hover:rotate-180">
            <ChevronDown className="h-3 w-3" />
          </span>
        )}
      </div>
    )}
  </>
);
