import React, { useState } from 'react';
import { useAppDispatch } from '../redux-hooks';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../components/hoc/notification-provider';
import { useUserLogoutMutation } from '../../api/authApi';
import {
  setUIActiveUser,
  setUIIsUserEditingMode,
} from '../../store/slice/userSlice';
import { EUserRole } from '../../types/enums';
import Cookies from 'js-cookie';

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

  const sendLogoutRequest = async (handleCloseDrawer?: any) => {
    try {
      const response = await useLogout().unwrap();

      if(handleCloseDrawer){
        handleCloseDrawer();
      }
      notify('Success', response.message || successMessage, 'success');
      Cookies.remove('access_token_metadata');
      dispatch(
        setUIIsUserEditingMode({
          uiIsUserEditingMode: false,
          uiEditorInProfileMode: false,
          uiIsAdminInEditingMode:false,
          uiIsPageContentEditingMode:false
        })
      );

      router.replace('/');
      dispatch(
        setUIActiveUser({
          uiId: null,
          uiFullName: '',
          uiInitials: '',
          uiUniqueURL: '',
          uiIsAdmin: false,
          uiIsLoading: false,
          uiIsSuperAdmin: false,
          uiCanEdit: false,
          uiRole: [EUserRole.Public],
          uiPhotoURL: null,
        })
      );


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
