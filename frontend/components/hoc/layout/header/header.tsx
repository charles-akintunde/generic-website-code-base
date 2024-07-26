'use client';
import React, { useState } from 'react';
import menuIcon from '@/assets/icons/menu.svg';
import logo from '@/assets/icons/gw-logo.png';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { toggleDrawer } from '@/store/slice/layoutSlice';
import Drawer from '../drawer/drawer';
import Image from 'next/image';
import { MenuItems } from '../menu-items/menu-items';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Logo from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Avatar, Space } from 'antd';
import { containerPaddingStyles } from '@/styles/globals';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, RefreshCw } from 'lucide-react';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import LogoutButton from '@/components/common/button/logout-button';
import AppButton from '@/components/common/button/app-button';

export const UserProfile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { currentUser } = useUserLogin();

  const handleLoginLogout = () => {
    setLoggedIn(!loggedIn);
  };

  if (!currentUser) {
    return (
      <Link
        href={'/sign-in'}
        className="text-sm  text-primary transition duration-300 ease-in-out"
      >
        Log in
      </Link>
    );
  }

  const firstName = currentUser.firstname;
  const lastName = currentUser.lastname;
  const fullName = firstName + ' ' + lastName;
  const initails = firstName[0] + lastName[0];

  console.log(initails, 'initails');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="flex items-center cursor-pointer p-2 px-4 rounded-sm space-x-2 text-sm hover:bg-slate-200 transition duration-300 ease-in-out">
          <Avatar
            style={{
              cursor: 'pointer',
              textTransform: 'uppercase',
              backgroundColor: '#69b1ff',
              transition: 'background-color 0.3s ease-in-out',
            }}
            // size={40}
            // src={''}
          >
            {initails}
          </Avatar>

          <DownOutlined style={{ fontSize: '10px' }} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 hidden lg:block">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/user-profile/${currentUser?.Id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href={`/reset-password`}>
            <DropdownMenuItem className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          {/* <LogOut className="mr-2 h-4 w-4" /> */}
          <LogoutButton
            trigger={
              <>
                <User className="mr-2 h-4 w-4" /> Logout
              </>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-white border-b border-glassmorphism h-20 shadow-sm">
        <div className={`${containerPaddingStyles}`}>
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
