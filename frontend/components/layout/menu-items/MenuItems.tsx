import React from 'react';
import MenuItem from './MenuItem';
import { MenuItemProps } from '@/types/commonTypes';
import useMenuItems from '@/hooks/api-hooks/useMenuItems';

const menuItems = [
  { name: 'Home', href: '/', display: false },
  { name: 'Teams', href: '/teams', display: false },
  { name: 'News', href: '/news', display: false },
  { name: 'Events', href: '/events', display: false },
  { name: 'About Us', href: '/about', display: false },
  { name: 'Admin Panel', href: '/admin-panel', display: false },
];

const MenuItems = () => {
  const { menuItems } = useMenuItems();
  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      {menuItems.map((menuItem, index) => (
        <MenuItem
          key={index}
          menuItem={menuItem.name}
          href={menuItem.href}
          display={menuItem.display}
        />
      ))}
    </div>
  );
};

export default MenuItems;
