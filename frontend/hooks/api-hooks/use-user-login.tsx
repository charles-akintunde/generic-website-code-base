'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../redux-hooks';
import {
  useGetActiveUserQuery,
  useRefreshTokenMutation,
  useUserLoginMutation,
} from '../../api/authApi';
import { IUserInfo, IUserLogin } from '../../types/componentInterfaces';
import { IUserLoginRequest } from '../../types/requestInterfaces';
import { EUserRole } from '../../types/enums';
import { reloadPage, transformToUserInfo } from '../../utils/helper';
import { setUIActiveUser } from '../../store/slice/userSlice';
import { useNotification } from '../../components/hoc/notification-provider';
import { Cookie } from 'lucide-react';

const useUserLogin = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activeUserRefetch,
  } = useGetActiveUserQuery();
  const [
    refreshToken,
    {
      isError: hasRefreshTokenError,
      isSuccess: isRefreshTokenSuccess,
      isLoading: isRefreshTokenLoading,
    },
  ] = useRefreshTokenMutation();

  const router = useRouter();
  const [userLogin, { isSuccess, isError, isLoading }] = useUserLoginMutation();
  const [successMessage, setSuccessMessage] = useState<string>(
    'Your account has been created. Go to you mail to complete verification.'
  );
  const [errorMessage, setErrorMessage] = useState<string>('An error occurred');

  const sendLoginRequest = async (userLoginData: IUserLogin) => {
    try {
      const userLoginRequestData: IUserLoginRequest = {
        UI_Email: userLoginData.email,
        UI_Password: userLoginData.password,
      };
      const response = await userLogin(userLoginRequestData).unwrap();
      const userData = response.data.user_data;
      const userProfile: IUserInfo = transformToUserInfo(
        userData
      );
      const activeUserData = {
        uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
        uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
        uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
        uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
        uiId: userProfile.id,
        uiIsLoading: isActiveUserFetchLoading,
        uiCanEdit:
          userProfile.uiRole.includes(EUserRole.Admin) ||
          userProfile.uiRole.includes(EUserRole.SuperAdmin),
        uiRole: userProfile.uiRole,
        uiPhotoURL: userProfile.uiPhoto,
      };

      dispatch(
        setUIActiveUser(activeUserData)
      );


      notify('Success', response.message || successMessage, 'success');

      activeUserRefetch();
      router.replace('/');
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        'An unexpected error occurred. Please try again.';
      notify('Error', errorMessage, 'error');
    }
  };

  useEffect(() => {
    const fetchUserData = () => {
      if (activeUserData?.data) {
        const userProfile: IUserInfo = transformToUserInfo(
          activeUserData?.data
        );
        dispatch(
          setUIActiveUser({
            uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
            uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
            uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
            uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
            uiId: userProfile.id,
            uiIsLoading: isActiveUserFetchLoading,
            uiCanEdit:
              userProfile.uiRole.includes(EUserRole.Admin) ||
              userProfile.uiRole.includes(EUserRole.SuperAdmin),
            uiRole: userProfile.uiRole,
            uiPhotoURL: userProfile.uiPhoto,
          })
        );
      } else if (!isActiveUserFetchLoading && !hasActiveUserFetchError) {
        dispatch(
          setUIActiveUser({
            uiId: null,
            uiFullName: '',
            uiInitials: '',
            uiIsAdmin: false,
            uiIsLoading: isActiveUserFetchLoading,
            uiIsSuperAdmin: false,
            uiCanEdit: false,
            uiRole: [EUserRole.Public],
            uiPhotoURL: null,
          })
        );
      }
    };

    fetchUserData();
  }, [activeUserData, dispatch, isActiveUserFetchLoading]);

  return {
    isSuccess,
    isError,
    successMessage,
    errorMessage,
    isLoading,
    sendLoginRequest,
    isActiveUserFetchLoading,
    activeUserRefetch
  };
};

export default useUserLogin;
