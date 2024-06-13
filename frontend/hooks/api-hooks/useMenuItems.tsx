import React, { useEffect, useState } from 'react';
import { useGetMenuItemsQuery } from '@/api/menuApi';
import { useNotification } from '@/components/hoc/NotificationProvider';
import { IPageMenuItem } from '@/types/componentInterfaces';
import { PAGES_DIR_ALIAS } from 'next/dist/lib/constants';
import { Page } from '@/types/backendResponseInterfaces';
import { toKebabCase } from '@/utils/helper';
import { systemMenuItems } from '@/components/layout/menu-items';

const useMenuItems = () => {
  const { data: menuItemData, isLoading } = useGetMenuItemsQuery();
  const [menuItems, setMenuItems] = useState<IPageMenuItem[]>([]);

  useEffect(() => {
    if (menuItemData && menuItemData?.data) {
      const dynamicMenuItems = menuItemData?.data.Pages.map((page: Page) => ({
        pageId: page.PG_ID,
        pageName: page.PG_Name,
        pagePermission: page.PG_Permission,
        pageType: page.PG_Type,
        isHidden: false,
        href: `/${toKebabCase(page.PG_Name)}`,
      }));
      const combinedMenuItems = [...systemMenuItems, ...dynamicMenuItems];
      setMenuItems(combinedMenuItems);
    }
  }, [menuItemData]);

  return { menuItems, isLoading };
};

export default useMenuItems;
