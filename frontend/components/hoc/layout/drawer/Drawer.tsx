'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
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
import { MobileMenuItems } from '../menu-items/MenuItems';
import appLogo from '@/assets/icons/gw-logo.png';
import Image from 'next/image';
import Logo from '@/components/common/Logo';
import Link from 'next/link';
import { LogOutIcon } from 'lucide-react';
import OutlinedButton from '@/components/common/button/AppButton';
import LoadingButton from '@/components/common/button/LoadingButton';
import LogoutButton from '@/components/common/button/LogoutButton';

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
