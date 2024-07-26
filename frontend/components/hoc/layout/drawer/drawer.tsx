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
import { LogOut, LogOutIcon } from 'lucide-react';
import OutlinedButton from '@/components/common/button/app-button';
import LoadingButton from '@/components/common/button/loading-button';
import LogoutButton from '@/components/common/button/logout-button';
import AppButton from '@/components/common/button/app-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile } from '../header/header';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { Avatar } from 'antd';

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

  return (
    <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
      <SheetContent side={'left'}>
        <SheetHeader>
          <div className="flex items-center pl-6">
            <Logo />
          </div>
        </SheetHeader>
        <ScrollArea className="overflow-y-auto max-h-[calc(100vh-10rem)] hide-scrollbar">
          {/* Scrollable container */}
          <MobileMenuItems />
        </ScrollArea>

        <SheetFooter className="w-full bg-white z-20">
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
                    classNames="text-primary hover:bg-white hover:text-primary"
                    //onClick={sendLogoutRequest(handleCloseDrawer)}
                  />
                }
              />
              <SheetClose>
                <Link href={`user-profile/${currentUser.Id}`}>
                  <Avatar
                    style={{
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      backgroundColor: '#69b1ff',
                      transition: 'background-color px-0 0.3s ease-in-out',
                    }}
                  >
                    {initails}
                  </Avatar>
                </Link>
              </SheetClose>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
