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
import { UserOutlined } from '@ant-design/icons';
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import Link from 'next/link';

const UserProfile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { currentUser } = useUserLogin();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar style={{ cursor: 'pointer' }} src={''}>
          USER
        </Avatar>
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
        </DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
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
