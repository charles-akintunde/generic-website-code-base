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
import { LogOutIcon } from 'lucide-react';
import OutlinedButton from '@/components/common/button/app-button';
import LoadingButton from '@/components/common/button/loading-button';
import LogoutButton from '@/components/common/button/logout-button';

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppSelector((state) => state.layout.isDrawerOpen);

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
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)] hide-scrollbar">
          {' '}
          {/* Scrollable container */}
          <MobileMenuItems />
        </div>

        <SheetFooter className="absolute pl-6 bottom-4">
          {/* <SheetClose> */}
          <LogoutButton />
          {/* </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
