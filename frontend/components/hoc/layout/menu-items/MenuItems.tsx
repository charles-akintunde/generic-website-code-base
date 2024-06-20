import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import { IPageMenuItem } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/usePage';

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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call immediately on initial render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const calculateVisibleItems = (items: IPageMenuItem[]) => {
      const containerWidth =
        document.querySelector('.menu-container')?.clientWidth ||
        window.innerWidth;
      const itemWidth = 120; // Approximate width of each item including margins

      const maxVisibleItems = Math.floor(containerWidth / itemWidth);
      const visible = items.slice(0, maxVisibleItems);
      const remaining = items.slice(maxVisibleItems);

      setVisibleItems(visible);
      setRemainingItems(remaining);
    };

    calculateVisibleItems(menuItems);
  }, [menuItems, windowWidth]);

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
        <div className="flex flex-wrap space-x-6 mt-2">
          {remainingItems.map((menuItem: IPageMenuItem, index: number) => (
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
      )}
    </div>
  );
};
