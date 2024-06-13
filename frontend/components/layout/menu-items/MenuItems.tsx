import React from 'react';
import MenuItem from './MenuItem';
import useMenuItems from '@/hooks/api-hooks/useMenuItems';
import { IPageMenuItem } from '@/types/componentInterfaces';

const MenuItems = () => {
  const { menuItems } = useMenuItems();
  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      {menuItems.map((menuItem: IPageMenuItem, index) => (
        <MenuItem
          key={index}
          pageName={menuItem.pageName}
          href={menuItem.href}
          isHidden={menuItem.isHidden}
        />
      ))}
    </div>
  );
};

export default MenuItems;
