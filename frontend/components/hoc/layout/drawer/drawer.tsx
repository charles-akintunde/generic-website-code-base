'use client';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { closeDrawer } from '../../../../store/slice/layoutSlice';
import { Sheet, SheetContent, SheetHeader } from '../../../ui/sheet';
import { MobileMenuItems } from '../menu-items/menu-items';
import Logo from '../../../common/logo';
import Link from 'next/link';
import { LogIn, LogOut } from 'lucide-react';
import LogoutButton from '../../../common/button/logout-button';
import AppButton from '../../../common/button/app-button';
import { ScrollArea } from '../../../ui/scroll-area';
import { Avatar, Menu, MenuProps } from 'antd';
import HoverableCard from '../../../common/hover-card';
import { transitionStyles } from '../../../../styles/globals';
import usePage from '../../../../hooks/api-hooks/use-page';
import { hasNavItems } from '../../../../utils/helper';
import { usePathname } from 'next/navigation';
import AppLoading from '../../../common/app-loading';

type MenuItem = Required<MenuProps>['items'][number];

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isDrawerOpen = useAppSelector((state) => state.layout.isDrawerOpen);
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiFullName = uiActiveUser.uiFullName;
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const uiId = uiActiveUser.uiId;
  const uiIntials = uiActiveUser.uiInitials;
  const { navMenuItems } = usePage();
  const [isLoading, setIsLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState(
    hasNavItems(navMenuItems, pathname)
  );

  const handleClose = () => {
    dispatch(closeDrawer());
  };

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
    handleClose();
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
    <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
      <SheetContent className="min-h-screen" side="left">
        <SheetHeader>
          <div className="flex items-center pl-6">
            <Logo />
          </div>
        </SheetHeader>

        <ScrollArea className="overflow-y-auto max-h-[calc(100vh-15rem)] hide-scrollbar">
          <Menu
            className="space-y-10"
            onClick={onClickNavMenuItem}
            selectedKeys={activeNavItem ? [activeNavItem] : []}
            expandIcon={<></>}
            mode="inline"
            items={navMenuItems}
          />
        </ScrollArea>

        <footer className="w-full absolute bottom-5 bg-white z-20">
          {uiId ? (
            <div className="flex w-full items-center justify-between px-6">
              <HoverableCard>
                <LogoutButton
                  trigger={
                    <AppButton
                      buttonText="Logout"
                      Icon={LogOut}
                      isRightPosition={false}
                      variant="ghost"
                      classNames={`${transitionStyles} p-0 hover:bg-inherit hover:text-inherit text-primary`}
                    />
                  }
                />
              </HoverableCard>
              {/* <Link onClick={handleClose} href={`/user-profile/${uiId}`}>
                <HoverableCard classNames="flex items-center cursor-pointer space-x-2">
                  <Avatar
                    style={{
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      backgroundColor: '#d9d9d9',
                      color: 'black',
                      transition: 'background-color px-0 0.3s ease-in-out',
                    }}
                  >
                    {uiIntials}
                  </Avatar>
                  <p className="text-xs">{uiFullName}</p>
                </HoverableCard>
              </Link> */}
            </div>
          ) : (
            <HoverableCard>
              <Link
                href="/sign-in"
                className="text-md cursor-pointer flex text-primary items-center transition duration-300 ease-in-out"
              >
                <LogIn className="mr-2 h-4 w-4" /> Log in
              </Link>
            </HoverableCard>
          )}
        </footer>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
