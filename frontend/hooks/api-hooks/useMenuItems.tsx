import React, { useEffect, useState } from 'react';
import { useGetMenuItemsQuery } from '@/api/menuApi';
import { useNotification } from '@/components/common/NotificationProvider';

const useMenuItems = () => {
  const { data, error, isLoading, isSuccess } = useGetMenuItemsQuery();
  // const { notify, notifyWithAction } = useNotification();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  console.log(error, 'error');

  console.log(data, 'Menu ITEMS');

  useEffect(() => {
    if (isLoading) {
      // notify('Loading menu items...', '', 'info');
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess && data) {
      setMenuItems(data);
      // notify('Menu items loaded successfully!', '', 'success');
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      // notify('Menu items loaded successfully!', '', 'success');
    }
  }, [isSuccess]);

  // useEffect(() => {
  //   if (error) {
  //     notifyWithAction(
  //       'Failed to load menu items.',
  //       'Would you like to retry?',
  //       () => {
  //         // Retry logic here
  //         window.location.reload();
  //       },
  //       () => {
  //         // Cancel logic here
  //         console.log('User canceled the retry action');
  //       }
  //     );
  //   }
  // }, [error, notifyWithAction]);

  return { menuItems, error, isLoading };
};

export default useMenuItems;
