import { useUserLogoutMutation } from '@/api/authApi';
import { useNotification } from '@/components/hoc/notification-provider';
import React, { useState } from 'react';
import { useAppDispatch } from '../redux-hooks';
import { setUIActiveUser } from '@/store/slice/userSlice';
import { EUserRole } from '@/types/enums';
import { useRouter } from 'next/navigation';
import { reloadPage } from '@/utils/helper';

const useLogout = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const [useLogout, { isSuccess, isLoading }] = useUserLogoutMutation();
  const [successMessage, setSuccessMessage] = useState<string>(
    'Account verification successful'
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    'Account verification failed'
  );
  const router = useRouter();

  const sendLogoutRequest = async (handleCloseDrawer: any) => {
    try {
      const response = await useLogout().unwrap();
      notify('Success', response.message || successMessage, 'success');
      dispatch(
        setUIActiveUser({
          uiId: null,
          uiFullName: '',
          uiInitials: '',
          uiIsAdmin: false,
          uiIsSuperAdmin: false,
          uiCanEdit: false,
          uiRole: [EUserRole.Public],
          uiPhotoURL: null,
        })
      );

      handleCloseDrawer();
      router.refresh();
      reloadPage();
    } catch (error: any) {
      console.log(error);
      notify(
        'Error',
        error?.data?.message || error?.data?.detail || errorMessage,
        'error'
      );
    }
  };
  return { sendLogoutRequest, isLoading, isSuccess };
};

export default useLogout;
