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
import HoverableCard from '../../../common/hover-card';
import {
  IUIActiveUser,

} from '../../../../types/componentInterfaces';
import usePage from '../../../../hooks/api-hooks/use-page';
import { usePathname } from 'next/navigation';
import AppLoading from '../../../common/app-loading';
import { hasNavItems } from '../../../../utils/helper';
import useUserLogin from '../../../../hooks/api-hooks/use-user-login';
import { containerNoFlexPaddingStyles } from '../../../../styles/globals';
import useLogout from '../../../../hooks/api-hooks/use-logout';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import ExpiredSessionHandler from '../../../common/expired-session-handler';

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
  const { sendLogoutRequest } = useLogout();
  const userFullName = uiActiveUser.uiFullName;
  const transformedName = userFullName
  .toLowerCase() 
  .replace(/\s+/g, '-');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>{trigger}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 hidden lg:block">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/profile/${transformedName}?id=${uiId}`}>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
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
            <Link href={`/reset-password`}>
            <DropdownMenuItem className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
          </Link>
           <DropdownMenuItem onClick={() => {
             sendLogoutRequest();}} className="cursor-pointer">
            <div className='flex items-center' 
             >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
              </div>
               
              </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserProfile = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const initails = uiActiveUser.uiInitials;

 

  return (
    <div className="flex items-center space-x-1">
     

        <UserProfileDropDown
          trigger={
            <HoverableCard>
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
             </HoverableCard>
          }
          uiActiveUser={uiActiveUser}
        />
     
    </div>
  );
};

const Header: React.FC = ({}) => {
  const dispatch = useAppDispatch();
  const { isActiveUserFetchLoading, activeUserRefetch } = useUserLogin();
  const pathname = usePathname();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);

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

  const metadataCookie = Cookies.get('access_token_metadata');

  console.log( Cookies.get('access_token_metadata'),"ACCESS TOKEN")

  useEffect(() => {
    const key = hasNavItems(navMenuItems, pathname);
    setActiveNavItem(key);
    setIsLoading(false);
  }, [pathname, navMenuItems]);

  if (isActiveUserFetchLoading) {
    return;
  }

  return (
    <>
    <ExpiredSessionHandler isActiveUserFetchLoading ={uiActiveUser.uiIsLoading}/>
      {true ? (
        <>
          {' '}
          <header className="sticky top-0 z-50 overflow-hidden  h-20 shadow-sm w-full bg-white">
            <div
              className={`flex h-full ${containerNoFlexPaddingStyles}`}
            >
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
                  {
                    uiActiveUser.uiId ? <UserProfile key={uiActiveUser.uiId} />: <Link
                    href={'/sign-in'}
                    className="text-md justify-between cursor-pointer flex text-primary items-center transition duration-300 ease-in-out"
                  >
                    <HoverableCard>
                      <LogIn className="mr-2 h-4 w-4" /> Log in
                    </HoverableCard>
                  </Link>
                  }
                
                </div>
                <div
                  className="block lg:hidden cursor-pointer"
                  onClick={handleDrawerToggle}
                >
                  <Image
                    src={menuIcon}
                    alt="hamburger"
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>
          </header>
          <div className="md:block z-50">
            <Drawer />
          </div>{' '}
        </>
      ) : (
        <AppLoading />
      )}
    </>
  );
};

export default Header;
