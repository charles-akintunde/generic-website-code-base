'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { closeDrawer } from '@/store/slice/layoutSlice';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MobileMenuItems } from '../menu-items/menu-items';
import appLogo from '@/assets/icons/gw-logo.png';
import Image from 'next/image';
import Logo from '@/components/common/logo';
import Link from 'next/link';
import { ChevronDown, LogOut, LogOutIcon } from 'lucide-react';
import OutlinedButton from '@/components/common/button/app-button';
import LoadingButton from '@/components/common/button/loading-button';
import LogoutButton from '@/components/common/button/logout-button';
import AppButton from '@/components/common/button/app-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile } from '../header/header';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { Avatar } from 'antd';
import HoverableCard from '@/components/common/hover-card';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { transitionStyles } from '@/styles/globals';

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppSelector((state) => state.layout.isDrawerOpen);
  const { currentUser } = useUserLogin();
  const firstName = currentUser && currentUser.firstname;
  const lastName = currentUser && currentUser.lastname;
  const fullName = firstName + ' ' + lastName;
  const initails = firstName && lastName && firstName[0] + lastName[0];

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
  ];

  return (
    <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
      <SheetContent className="min-h-screen" side={'left'}>
        <SheetHeader>
          <div className="flex items-center pl-6">
            <Logo />
          </div>
        </SheetHeader>
        <ScrollArea className="overflow-y-auto max-h-[calc(100vh-10rem)] hide-scrollbar">
          {/* Scrollable container */}
          <MobileMenuItems />
        </ScrollArea>

        <footer className="w-full absolute bottom-5 bg-white z-20">
          {/* Aligns the footer content to the left */}
          {currentUser && (
            <div className="flex w-full items-center justify-between px-6">
              <LogoutButton
                trigger={
                  <AppButton
                    buttonText="Logout"
                    Icon={LogOut}
                    isRightPosition={false}
                    variant={'ghost'}
                    classNames={`${transitionStyles} p-0 hover:bg-white hover:text-primary`}
                    //onClick={sendLogoutRequest(handleCloseDrawer)}
                  />
                }
              />
              <Link
                onClick={handleClose}
                href={`/user-profile/${currentUser.Id}`}
              >
                <HoverableCard
                  classNames={`flex items-center cursor-pointer space-x-2`}
                >
                  <Avatar
                    style={{
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      backgroundColor: '#69b1ff',
                      transition: 'background-color px-0 0.3s ease-in-out',
                    }}
                  >
                    {initails}
                  </Avatar>{' '}
                  <p className="text-xs">
                    {firstName} {lastName}
                  </p>
                  {/* <ChevronDown className="h-3 w-3" /> */}
                </HoverableCard>
              </Link>
            </div>
          )}
        </footer>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
