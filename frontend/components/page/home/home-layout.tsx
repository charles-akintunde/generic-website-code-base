'use client';
import React, { useEffect } from 'react';
import HomeWithFooter from './home-with-footer';
import HomeWithoutFooter from './home-without-footer';
import { appConfig } from '../../../utils/appConfig';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import { setUIActiveUser } from '../../../store/slice/userSlice';
import { EUserRole } from '../../../types/enums';
import { IUserInfo } from '../../../types/componentInterfaces';
import { transformToUserInfo } from '../../../utils/helper';
import { useGetActiveUserQuery } from '../../../api/authApi';

const HomeLayout = () => {
  const dispatch = useAppDispatch();
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();

  useEffect(() => {
    if (isActiveUserFetchSuccess && activeUserData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(activeUserData.data);
      dispatch(
        setUIActiveUser({
          uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
          uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
          uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
          uiIsLoading: false,
          uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
          uiId: userProfile.id,
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
          uiIsLoading: false,
          uiIsSuperAdmin: false,
          uiCanEdit: false,
          uiRole: [EUserRole.Public],
          uiPhotoURL: null,
        })
      );
    }
  }, [
    activeUserData,
    isActiveUserFetchLoading,
    hasActiveUserFetchError,
    isActiveUserFetchSuccess,
    dispatch,
  ]);

  return (
    <>
      {appConfig.useHomePageWithFooter ? (
        <HomeWithFooter />
      ) : (
        <HomeWithoutFooter />
      )}
    </>
  );
};

export default HomeLayout;
