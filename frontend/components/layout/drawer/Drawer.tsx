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

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppSelector((state) => state.layout.isDrawerOpen);

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  return (
    <div className="hidden">
      <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
        <SheetContent side={'left'}>
          <SheetHeader>
            <div className="flex items-center">
              <Image
                src={appLogo}
                alt="App logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <p className="text-base font-bold">Generic Website</p>
            </div>
          </SheetHeader>
          <div>
            <MenuItems />
          </div>

          {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Drawer;
