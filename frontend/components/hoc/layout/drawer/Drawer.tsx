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
import MenuItems from '../menu-items/MenuItems';
import appLogo from '@/assets/icons/gw-logo.png';
import Image from 'next/image';
import Logo from '@/components/common/Logo';
import Link from 'next/link';
import { LogOutIcon } from 'lucide-react';

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
        <MenuItems />

        <SheetFooter className="absolute pl-6 bottom-4">
          <SheetClose>
            <Button
              variant="outline"
              className="border border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
              asChild
            >
              <Link href="/sign-in">
                <LogOutIcon className="mr-2 h-5 w-5" /> Logout
              </Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
