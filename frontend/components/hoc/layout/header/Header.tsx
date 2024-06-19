'use client';
import React from 'react';
import menuIcon from '@/assets/icons/menu.svg';
import logo from '@/assets/icons/gw-logo.png';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { toggleDrawer } from '@/store/slice/layoutSlice';
import Drawer from '../drawer/Drawer';
import Image from 'next/image';
import MenuItems from '../menu-items/MenuItems';
import LgNavigation from '../navigation/LgNavigation';
import Logo from '@/components/common/Logo';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-glassmorphism border-b border-glassmorphism h-14 shadow-sm">
        <div className="container mx-auto flex items-center h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Logo />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="hidden lg:block">
              <MenuItems />
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
