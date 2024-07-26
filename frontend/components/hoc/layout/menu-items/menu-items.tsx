import React, { useEffect, useLayoutEffect, useState } from 'react';
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

export const MobileMenuItems = () => {
  const { menuItems } = usePage();

  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      {menuItems.map((menuItem: IPageMenuItem, index) => (
        <MenuItem
          key={index}
          pageName={menuItem.pageName}
          href={menuItem.href}
          isHidden={menuItem.isHidden}
          pagePermission={menuItem.pagePermission}
          pageType={menuItem.pageType}
        />
      ))}
    </div>
  );
};

export const MenuItems = () => {
  const { menuItems } = usePage();
  const [visibleItems, setVisibleItems] = useState<IPageMenuItem[]>([]);
  const [remainingItems, setRemainingItems] = useState<IPageMenuItem[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      const containerWidth =
        document.querySelector('.menu-container')?.clientWidth ||
        window.innerWidth;
      const itemWidth = 100; // Approximate width of each item including margins

      const maxVisibleItems = Math.floor(containerWidth / itemWidth);
      const visible = menuItems.slice(0, maxVisibleItems);
      const remaining = menuItems.slice(maxVisibleItems);

      setVisibleItems(visible);
      setRemainingItems(remaining);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call immediately on initial render

    return () => window.removeEventListener('resize', handleResize);
  }, [menuItems]);

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
                  <DropdownMenuItem key={index}>
                    <Link href={menuItem.href}>{menuItem.pageName}</Link>
                  </DropdownMenuItem>
                )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
