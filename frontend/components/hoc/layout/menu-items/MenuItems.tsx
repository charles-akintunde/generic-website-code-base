import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import useMenuItems from '@/hooks/api-hooks/useMenuItems';
import { IPageMenuItem } from '@/types/componentInterfaces';
import usePage from '@/hooks/api-hooks/usePage';
import { Menu, Dropdown } from 'antd';
import { Button } from '@/components/ui/button';
import { EllipsisOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.css'; // Import Ant Design styles

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
  const [dropdownItems, setDropdownItems] = useState<IPageMenuItem[]>([]);
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
    // Calculate the maximum number of visible items based on window width and item size
    const itemWidth = 90; /* Estimate average item width (consider padding, margins) */ // Replace with your estimated width
    const maxVisibleItems = Math.floor(windowWidth / itemWidth);

    if (menuItems.length > maxVisibleItems) {
      setVisibleItems(menuItems.slice(0, maxVisibleItems));
      setDropdownItems(menuItems.slice(maxVisibleItems));
    } else {
      setVisibleItems(menuItems);
      setDropdownItems([]);
    }
  }, [menuItems, windowWidth]);

  const renderDropdownMenu = () => (
    <Menu>
      {dropdownItems.map((menuItem: IPageMenuItem, index: number) => (
        <Menu.Item key={index}>
          <a href={menuItem.href}>{menuItem.pageName}</a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      {visibleItems.map((menuItem: IPageMenuItem, index: number) => (
        <MenuItem
          key={index}
          pageName={menuItem.pageName}
          href={menuItem.href}
          isHidden={menuItem.isHidden}
          pagePermission={menuItem.pagePermission}
          pageType={menuItem.pageType}
          // Ensure text doesn't wrap unnecessarily
        />
      ))}
      <div className="hidden  lg:flex lg:items-center">
        {dropdownItems.length > 0 && (
          <Dropdown overlay={renderDropdownMenu} trigger={['click']}>
            <Button
              variant="ghost"
              className="flex items-center justify-center w-6 h-6 hover:bg-gray-300"
            >
              <EllipsisOutlined className="text-xl" />
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};
