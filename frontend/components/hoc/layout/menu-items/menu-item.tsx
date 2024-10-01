'use client';
import React, { useEffect, useState } from 'react';
import { IPageMenuItem } from '@/types/componentInterfaces';
import Link from 'next/link';
import cx from 'classnames';
import { usePathname } from 'next/navigation';
import { closeDrawer } from '@/store/slice/layoutSlice';
import { useAppDispatch } from '@/hooks/redux-hooks';

const MenuItem: React.FC<IPageMenuItem> = ({ pageName, href, isHidden }) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(closeDrawer());
  };

  return (
    <Link
      href={href}
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
