'use client';
import React, { useState } from 'react';
import menuIcon from '@/assets/icons/menu.svg';
import logo from '@/assets/icons/gw-logo.png';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { toggleDrawer } from '@/store/slice/layoutSlice';
import Drawer from '../drawer/Drawer';
import Image from 'next/image';
import { MenuItems } from '../menu-items/MenuItems';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Avatar, Space } from 'antd';

const UserProfile = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginLogout = () => {
    setLoggedIn(!loggedIn);
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleLoginLogout}>
        {loggedIn ? 'Logout' : 'Login'}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Avatar icon={<UserOutlined />} />
    </Dropdown>
  );
};

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-glassmorphism border-b border-glassmorphism h-20 shadow-sm">
        <div className="container mx-auto flex items-center h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <MenuItems />
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-4">
            <div className="hidden lg:block">
              <UserProfile />
            </div>
            <div
              className="block lg:hidden cursor-pointer"
              onClick={handleDrawerToggle}
            >
              <Image src={menuIcon} alt="hamburger" width={30} height={30} />
            </div>
          </div>
        </div>
      </header>
      <div className="md:block z-50">
        <Drawer />
      </div>
    </>
  );
};

export default Header;
