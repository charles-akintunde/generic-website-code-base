'use client';
import React, { useEffect, useState } from 'react';
import menuIcon from '../../../../assets/icons/menu.svg';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { toggleDrawer } from '../../../../store/slice/layoutSlice';
import Drawer from '../drawer/drawer';
import Image from 'next/image';
import { Menu, MenuProps, Tooltip } from 'antd';
import Logo from '../../../common/logo';
import { Avatar } from 'antd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import { User, RefreshCw, LogOut, LogIn, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import LogoutButton from '../../../common/button/logout-button';
import { Separator } from '../../../ui/separator';
import HoverableCard from '../../../common/hover-card';
import useUserInfo from '../../../../hooks/api-hooks/use-user-info';
import { IUIActiveUser } from '../../../../types/componentInterfaces';
import usePage from '../../../../hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import AppLoading from '../../../common/app-loading';
import { hasNavItems } from '../../../../utils/helper';

interface UserProfileDropDownProps {
  uiActiveUser: IUIActiveUser;
  trigger: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

export const UserProfileDropDown: React.FC<UserProfileDropDownProps> = ({
  uiActiveUser,
  trigger,
}) => {
  const uiId = uiActiveUser.uiId;
  const canEdit = uiActiveUser.uiCanEdit;

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
          {canEdit && (
            <Link href={`/admin-panel`}>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Panel
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserProfile = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const initails = uiActiveUser.uiInitials;
  const uiId = uiActiveUser.uiId;

  if (!uiId) {
    return (
      <Link
        href={'/sign-in'}
        className="text-md justify-between cursor-pointer flex text-primary items-center transition duration-300 ease-in-out"
      >
        <HoverableCard>
          <LogIn className="mr-2 h-4 w-4" /> Log in
        </HoverableCard>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <LogoutButton
        trigger={
          <div className="hover-card">
            <Tooltip title="Logout">
              <LogOut className="mr-2 h-4 w-4" />
            </Tooltip>
          </div>
        }
      />
      <Separator orientation="vertical" />
      <HoverableCard>
        <UserProfileDropDown
          trigger={
            <span className="flex space-x-1 items-center">
              <Avatar
                style={{
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  backgroundColor: '#d9d9d9',
                  color: '#374151',
                  transition: 'background-color 0.3s ease-in-out',
                }}
              >
                {initails}
              </Avatar>

              <ChevronDown className="h-3 w-3" />
            </span>
          }
          uiActiveUser={uiActiveUser}
        />
      </HoverableCard>
    </div>
  );
};

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const uiUser = useUserInfo();
  const pathname = usePathname();
  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  const { navMenuItems } = usePage();
  const [isLoading, setIsLoading] = useState(true);

  const [activeNavItem, setActiveNavItem] = useState(
    hasNavItems(navMenuItems, pathname)
  );

  const onClickNavMenuItem: MenuProps['onClick'] = (e) => {
    const keysNavItem = navMenuItems.map((item) => item?.key);
    if (e.key === '/') {
      setActiveNavItem(e.key);
    } else if (keysNavItem.includes(e.key)) {
      setActiveNavItem(e.key);
    } else {
      const key = hasNavItems(navMenuItems, pathname);

      setActiveNavItem(key);
    }
  };

  useEffect(() => {
    const key = hasNavItems(navMenuItems, pathname);
    setActiveNavItem(key);
    setIsLoading(false);
  }, [pathname, navMenuItems]);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <>
      <header className="sticky top-0 z-50 overflow-hidden  h-20 shadow-sm w-full bg-white">
        <div className={'container mx-auto flex h-full px-4 sm:px-6 lg:px-8'}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden lg:block max-w-[600px] space-x-4">
              <Menu
                style={{
                  flex: 'auto',
                  minWidth: 800,
                  borderBottom: 'none',
                  lineHeight: '80px',
                }}
                className="border-0 bottom-0 py-4 custom-menu"
                onClick={onClickNavMenuItem}
                mode="horizontal"
                expandIcon={<></>}
                //@ts-ignore
                itemPaddingInline={200}
                selectedKeys={activeNavItem ? [activeNavItem] : []}
                items={navMenuItems}
              />
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
