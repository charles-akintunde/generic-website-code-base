import React, { useEffect, useState } from 'react';
import { MenuItemProps } from '@/types/commonTypes';
import Link from 'next/link';
import cx from 'classnames';
import { usePathname } from 'next/navigation';

const MenuItem: React.FC<MenuItemProps> = ({ menuItem, href, display }) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (href === '/') {
      setIsActive(pathname === href);
    } else {
      setIsActive(pathname.startsWith(href));
    }
  }, [pathname, href]);

  return (
    <Link
      className={cx('text-xs hover:text-primary', {
        hidden: display,
        'text-primary': isActive,
      })}
      href={href}
      passHref
    >
      <nav className="text-xs">{menuItem}</nav>
    </Link>
  );
};

export default MenuItem;
