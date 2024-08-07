'use client';
import React from 'react';
import menuIcon from '@/assets/icons/menu.svg';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { toggleDrawer } from '@/store/slice/layoutSlice';
import Drawer from '../drawer/drawer';
import Image from 'next/image';
import { MenuItems } from '../menu-items/menu-items';
import { Tooltip } from 'antd';
import Logo from '@/components/common/logo';
import { Avatar } from 'antd';
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
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import LogoutButton from '@/components/common/button/logout-button';
import { Separator } from '@/components/ui/separator';
import HoverableCard from '@/components/common/hover-card';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { IUIActiveUser } from '@/types/componentInterfaces';

interface UserProfileDropDownProps {
  uiActiveUser: IUIActiveUser;
  trigger: React.ReactNode;
}

export const UserProfileDropDown: React.FC<UserProfileDropDownProps> = ({
  uiActiveUser,
  trigger,
}) => {
  const uiId = uiActiveUser.uiId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>{trigger}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 hidden lg:block">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/user-profile/${uiId}`}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserProfile = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const initails = uiActiveUser.uiInitials;

  if (!uiActiveUser.uiId) {
    return (
      <Link
        href={'/sign-in'}
        className="text-sm  text-primary transition duration-300 ease-in-out"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <HoverableCard>
        <LogoutButton
          trigger={
            <div>
              <Tooltip title="Logout">
                <div className="">
                  <LogOut className="mr-2 h-4 w-4" />
                </div>
              </Tooltip>
            </div>
          }
        />
      </HoverableCard>
      <Separator orientation="vertical" />
      <HoverableCard>
        <UserProfileDropDown
          trigger={
            <Tooltip title="Your Profile">
              <span className="flex space-x-2 items-center">
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
          }
          uiActiveUser={uiActiveUser}
        />
      </HoverableCard>
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
