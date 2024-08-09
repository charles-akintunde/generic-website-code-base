import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import MenuItem from './menu-item';
import { IPageMenuItem } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/use-page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, Flex, Tooltip } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { cx } from 'class-variance-authority';
import { usePathname } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];

export const MobileMenuItems = () => {
  const pathname = usePathname();
  const { menuItems } = usePage();
  const [isActive, setIsActive] = useState(false);
  const items: MenuItem[] = menuItems.map((menuItem: IPageMenuItem, index) => ({
    label: (
      <Link
        className={cx({
          hidden: menuItem.isHidden,
        })}
        href={`${menuItem.href}`}
      >
        {menuItem.pageName}
      </Link>
    ),
    key: `${menuItem.pageName}`,
  }));

  // useEffect(() => {
  //   if (href === '/') {
  //     setIsActive(pathname === href);
  //   } else {
  //     setIsActive(pathname.startsWith(href));
  //   }
  // }, [pathname, href]);

  // return (
  //   <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
  //     {menuItems.map((menuItem: IPageMenuItem, index) => (
  //       <MenuItem
  //         key={index}
  //         pageName={menuItem.pageName}
  //         href={menuItem.href}
  //         isHidden={menuItem.isHidden}
  //         pagePermission={menuItem.pagePermission}
  //         pageType={menuItem.pageType}
  //       />
  //     ))}
  //   </div>
  // );

  return <Menu items={items} />;
};

export const MenuItems = () => {
  const { menuItems } = usePage();
  const [visibleItems, setVisibleItems] = useState<IPageMenuItem[]>([]);
  const [remainingItems, setRemainingItems] = useState<IPageMenuItem[]>([]);

  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const items: MenuItem[] = menuItems.map((menuItem: IPageMenuItem, index) => ({
    label: (
      <Link
        className={cx({
          hidden: menuItem.isHidden,
        })}
        href={`${menuItem.href}`}
      >
        {menuItem.pageName}
      </Link>
    ),
    key: `${menuItem.pageName}`,
  }));

  const handleResize = useCallback(() => {
    const containerWidth =
      document.querySelector('.menu-container')?.clientWidth ||
      window.innerWidth;
    const itemWidth = 100; // Approximate width of each item including margins

    const maxVisibleItems = Math.floor(containerWidth / itemWidth);
    const visible = menuItems.slice(0, maxVisibleItems);
    const remaining = menuItems.slice(maxVisibleItems);

    setVisibleItems(visible);
    setRemainingItems(remaining);
  }, [menuItems]);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Call immediately on initial render and on rerender

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, menuItems]);

  return (
    <div className="menu-container flex flex-col lg:flex-row flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0 lg:space-x-6">
      {visibleItems.map((menuItem: IPageMenuItem, index: number) => (
        <MenuItem
          key={index}
          pageName={menuItem.pageName}
          href={menuItem.href}
          isHidden={menuItem.isHidden}
          pagePermission={menuItem.pagePermission}
          pageType={menuItem.pageType}
        />
      ))}
      {remainingItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Tooltip title="More Pages">
              <Button shape="circle" icon={<MoreOutlined />} />
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="hidden lg:block">
            <DropdownMenuLabel>More Pages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {remainingItems.map(
              (menuItem: IPageMenuItem, index: number) =>
                !menuItem.isHidden && (
                  <Link
                    className="cursor-pointer"
                    href={menuItem.href}
                    key={index}
                  >
                    <DropdownMenuItem>{menuItem.pageName}</DropdownMenuItem>
                  </Link>
                )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
