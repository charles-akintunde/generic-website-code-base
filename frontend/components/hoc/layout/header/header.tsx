'use client';
import React, { useState } from 'react';
import menuIcon from '@/assets/icons/menu.svg';
import logo from '@/assets/icons/gw-logo.png';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { toggleDrawer } from '@/store/slice/layoutSlice';
import Drawer from '../drawer/drawer';
import Image from 'next/image';
import { MenuItems } from '../menu-items/menu-items';
import { Menu, Dropdown, Tooltip } from 'antd';
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
import { User, RefreshCw, LogOut } from 'lucide-react';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import LogoutButton from '@/components/common/button/logout-button';
import AppButton from '@/components/common/button/app-button';
import { DecodedToken } from '@/utils/helper';
import { Separator } from '@/components/ui/separator';

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

  interface UserProfileDropDownProps {
    currentUser: DecodedToken;
  }

  const UserProfileDropDown: React.FC<UserProfileDropDownProps> = ({
    currentUser,
  }) => {
    const firstName = currentUser.firstname;
    const lastName = currentUser.lastname;
    const fullName = firstName + ' ' + lastName;
    const initails = firstName && lastName && firstName[0] + lastName[0];
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Tooltip title="Your Profile">
              <span className="flex items-center cursor-pointer p-2 px-4 rounded-sm space-x-2 text-sm hover:bg-zinc-100 transition duration-300 ease-in-out hover:text-primary">
                <Avatar
                  style={{
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    backgroundColor: '#69b1ff',
                    transition: 'background-color 0.3s ease-in-out',
                  }}
                >
                  {initails}
                </Avatar>

                <ChevronDown className="h-3 w-3" />
              </span>
            </Tooltip>
          </div>
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
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem className="cursor-pointer">
      
            <LogoutButton
              trigger={
                <>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </>
              }
            />
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      <LogoutButton
        trigger={
          <div>
            <Tooltip title="Logout">
              <div className="text-sm cursor-pointer rounded-sm hover:bg-zinc-100 p-4 px-4 flex items-center hover:text-primary transition duration-300 ease-in-out">
                <LogOut className="mr-2 h-4 w-4" />
              </div>
            </Tooltip>
          </div>
        }
      />
      <Separator orientation="vertical" />
      <UserProfileDropDown currentUser={currentUser} />{' '}
    </div>
  );
};

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  return (
    <>
      <header className="sticky top-0 z-40   h-20 shadow-sm w-full bg-white">
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
