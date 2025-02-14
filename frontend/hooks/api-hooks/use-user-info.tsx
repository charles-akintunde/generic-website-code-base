'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-hooks';

import { useRouter } from 'next/navigation';
import {
  useDeleteUserMutation,
  useEditRoleAndStatusMutation,
  useEditUserMutation,
  userApi
} from '../../api/userApi';
import {
  useGetActiveUserQuery,
  useResetPasswordWithEmailMutation,
  useResetPasswordWithTokenMutation,
} from '../../api/authApi';
import { useNotification } from '../../components/hoc/notification-provider';
import { IUserBase, IUserInfo } from '../../types/componentInterfaces';
import { transformToUserInfo } from '../../utils/helper';
import { EUserRole } from '../../types/enums';
import {
  setUIActiveUser,
  toggleCreateUserDialog,
} from '../../store/slice/userSlice';

export interface GetUsersRequest {
  page: number;
  limit: number;
}

export function sanitizeAndCompare(str1: string, str2: string) {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

export const useUserInfo = () => {
  const [deleteUser] = useDeleteUserMutation();
  const [
    resetPasswordWithEmail,
    {
      isError: hasResetPasswordWithError,
      isSuccess: isResetPasswordWithSuccess,
      isLoading: isResetPasswordWithLoading,
    },
  ] = useResetPasswordWithEmailMutation();

  const [
    resetPasswordWithToken,
    {
      isError: hasResetPasswordTokenWithError,
      isSuccess: isResetPasswordWithTokenSuccess,
      isLoading: isResetPasswordWithTokenLoading,
    },
  ] = useResetPasswordWithTokenMutation();

  const [
    editRoleAndStatus,
    {
      isError: hasEditRoleAndStatusError,
      isSuccess: isEditRoleAndStatusSuccess,
      isLoading: isEditRoleAndStatusLoading,
    },
  ] = useEditRoleAndStatusMutation();
  const [
    editPage,
    {
      isError: hasEditPageError,
      isSuccess: isEditPageSuccess,
      isLoading: isEditPageLoading,
    },
  ] = useEditUserMutation();
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const { notify } = useNotification();
  const dispatch = useAppDispatch();
  const [resetPasswordSuccessMessage, setResetPasswordSuccessMessage] =
    useState<string>();
  const router = useRouter();

  // useEffect(() => {
  //   if (activeUserData?.data) {
  //     const userProfile: IUserInfo = transformToUserInfo(activeUserData?.data);

  //     dispatch(
  //       setUIActiveUser({
  //         uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
  //         uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
  //         uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
  //         uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
  //         uiIsLoading: isActiveUserFetchLoading,
  //         uiId: userProfile.id,
  //         uiCanEdit:
  //           userProfile.uiRole.includes(EUserRole.Admin) ||
  //           userProfile.uiRole.includes(EUserRole.SuperAdmin),
  //         uiRole: userProfile.uiRole,
  //         uiPhotoURL: userProfile.uiPhoto,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       setUIActiveUser({
  //         uiId: null,
  //         uiFullName: '',
  //         uiInitials: '',
  //         uiIsAdmin: false,
  //         uiIsLoading: isActiveUserFetchLoading,
  //         uiIsSuperAdmin: false,
  //         uiCanEdit: false,
  //         uiRole: [EUserRole.Public],
  //         uiPhotoURL: null,
  //       })
  //     );
  //   }
  // }, [activeUserData, router]);

  const handleRemoveUser = async (user: IUserBase) => {
    try {
      const response = await deleteUser(user.id).unwrap();
      notify(
        'Success',
        response?.message || 'The page has been successfully deleted.',
        'success'
      );
    } catch (error: any) {
      console.log(error, 'ERROR');
      notify(
        'Error',
        error?.data?.message ||
          'Failed to delete the page. Please try again later.',
        'error'
      );
    }
  };

  const submitEmailForPasswordReset = async (email: string) => {
    try {
      const response = await resetPasswordWithEmail({
        UI_Email: email,
      }).unwrap();
      setResetPasswordSuccessMessage(response.message);
      notify(
        'Success',
        response.message ||
          'The user information has been successfully updated.',
        'success'
      );
    } catch (error: any) {
      console.error('Error editing user:', error);

      const errorMessage =
        error.data?.message ||
        error.data?.detail ||
        'Failed to reset password. Please try again later.';
      notify('Error', errorMessage, 'error');
    }
  };

  const submitPasswordResetWithToken = async (data: any) => {
    try {
      const response = await resetPasswordWithToken({
        UI_Token: data.token,
        UI_NewPassword: data.newPassword,
      }).unwrap();

      setResetPasswordSuccessMessage(response.message);
      notify(
        'Success',
        response.message || 'Password has been successfully reset.',
        'success'
      );
      router.replace('/sign-in');
    } catch (error: any) {
      const defaultErrorMessage =
        'Failed to reset password. Please try again later.';

      const errorMessage =
        error?.data?.message || error?.data?.detail || defaultErrorMessage;
      notify('Error', errorMessage, 'error');
    }
  };

  const submitEditRoleStatus = async (
    userId: string,
    userInfo: Partial<IUserBase>,
    initialUserInfo: IUserBase
  ) => {
    try {
      const isSameUser = sanitizeAndCompare(
        uiActiveUser?.uiId as string,
        userInfo?.id as string
      );
      let roles = [];

      if (
        userInfo.uiMainRoles &&
        !initialUserInfo.uiRole.includes(userInfo.uiMainRoles)
      ) {
        roles.push(Number(userInfo.uiMainRoles));
      }

      if (
        userInfo.uiIsUserAlumni !== initialUserInfo.uiIsUserAlumni &&
        userInfo.uiIsUserAlumni
      ) {
        roles = [Number(EUserRole.Alumni)];
      }

      roles = [...new Set(roles)];

      console.log({
        UI_ID: userId,
        UI_Role: roles.length == 0 ? undefined : roles,
        UI_Status: Number(userInfo.uiStatus),
        UI_MemberPosition: userInfo.uiMemberPosition
          ? Number(userInfo.uiMemberPosition)
          : undefined,
      },)

      if (uiActiveUser.uiIsSuperAdmin && !isSameUser) {
        const response = await editRoleAndStatus({
          UI_ID: userId,
          UI_Role: roles.length == 0 ? undefined : roles,
          UI_Status: Number(userInfo.uiStatus),
          UI_MemberPosition: userInfo.uiMemberPosition
            ? Number(userInfo.uiMemberPosition)
            : undefined,
        }).unwrap();
        dispatch(toggleCreateUserDialog());
        notify(
          'Success',
          response.message ||
            'The user information has been successfully updated.',
          'success'
        );
      } else {
        notify('Notice', 'You are not permitted to edit this user', 'warning');
      }
    } catch (error: any) {
      console.error('Error editing user:', error);

      const errorMessage =
        error.data?.message ||
        error.data?.detail ||
        'Failed to update the user information. Please try again later.';
      notify('Error', errorMessage, 'error');
    }
  };

  const submitEditUser = async (
    userId: string,
    userInfo: Partial<IUserInfo>,
    initialUserInfo: IUserInfo
  ) => {
    try {
      userInfo['id'] = userId;
      const isSameUser = sanitizeAndCompare(
        uiActiveUser?.uiId as string,
        userInfo?.id as string
      );

      let userInfoObj = {
        ['UI_About']: userInfo.uiAbout,
      };
      const formData = new FormData();

      if (userInfo.uiFirstName) {
        formData.append('UI_FirstName', userInfo.uiFirstName);
      }
      if (userInfo.uiLastName) {
        formData.append('UI_LastName', userInfo.uiLastName);
      }

      if (userInfo.uiCity !== undefined) {
        if (
          userInfo.uiCity &&
          userInfo.uiCity.length === 0 &&
          initialUserInfo?.uiCity &&
          initialUserInfo.uiCity.length > 0
        ) {
          formData.append('UI_City', ' ');
        } else {
          formData.append('UI_City', userInfo.uiCity ?? '');
        }
      }

      if (userInfo.uiPhoto !== undefined) {
        formData.append('UI_Photo', userInfo.uiPhoto ?? '');
      }

      if (userInfo.uiProvince !== undefined) {
        if (
          userInfo.uiProvince &&
          userInfo.uiProvince.length === 0 &&
          initialUserInfo?.uiProvince &&
          initialUserInfo.uiProvince.length > 0
        ) {
          formData.append('UI_Province', ' ');
        } else {
          formData.append('UI_Province', userInfo.uiProvince ?? '');
        }
      }

      if (userInfo.uiCountry !== undefined) {
        if (
          userInfo.uiCountry &&
          userInfo.uiCountry.length === 0 &&
          initialUserInfo?.uiCountry &&
          initialUserInfo.uiCountry.length > 0
        ) {
          formData.append('UI_Country', ' ');
        } else {
          formData.append('UI_Country', userInfo.uiCountry ?? '');
        }
      }

      if (userInfo.uiPostalCode !== undefined) {
        if (
          userInfo.uiPostalCode &&
          userInfo.uiPostalCode.length === 0 &&
          initialUserInfo?.uiPostalCode &&
          initialUserInfo.uiPostalCode.length > 0
        ) {
          formData.append('UI_PostalCode', ' ');
        } else {
          formData.append('UI_PostalCode', userInfo.uiPostalCode ?? '');
        }
      }

      if (userInfo.uiSuffix !== undefined) {
        if (
          userInfo.uiSuffix &&
          userInfo.uiSuffix.length === 0 &&
          initialUserInfo?.uiSuffix &&
          initialUserInfo.uiSuffix.length > 0
        ) {
          formData.append('UI_Suffix', ' ');
        } else {
          formData.append('UI_Suffix', userInfo.uiSuffix ?? '');
        }
      }

      if (userInfo.uiPrefix !== undefined) {
        if (
          userInfo.uiPrefix &&
          userInfo.uiPrefix.length === 0 &&
          initialUserInfo?.uiPrefix &&
          initialUserInfo.uiPrefix.length > 0
        ) {
          formData.append('UI_Prefix', ' ');
        } else {
          formData.append('UI_Prefix', userInfo.uiPrefix ?? '');
        }
      }

      if (userInfo.uiPhoneNumber !== undefined) {
        if (
          userInfo.uiPhoneNumber &&
          userInfo.uiPhoneNumber.length === 0 &&
          initialUserInfo?.uiPhoneNumber &&
          initialUserInfo.uiPhoneNumber.length > 0
        ) {
          formData.append('UI_PhoneNumber', ' ');
        } else {
          formData.append('UI_PhoneNumber', userInfo.uiPhoneNumber ?? '');
        }
      }

      if (userInfo.uiOrganization !== undefined) {
        if (
          userInfo.uiOrganization &&
          userInfo.uiOrganization.length === 0 &&
          initialUserInfo?.uiOrganization &&
          initialUserInfo.uiOrganization.length > 0
        ) {
          formData.append('UI_Organization', ' ');
        } else {
          formData.append('UI_Organization', userInfo.uiOrganization ?? '');
        }
      }

      if (userInfo.uiAbout) {
        formData.append('UI_About', JSON.stringify(userInfoObj));
      }

      if (isSameUser) {
        const response = await editPage({
          UI_ID: userId,
          // @ts-ignore
          formData,
        }).unwrap();
      
      const userProfile = transformToUserInfo(response.data);
      if(initialUserInfo.uiUniqueURL != userProfile.uiUniqueURL){

        const activeUserData = {
          uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
          uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
          uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
          uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
          uiId: userProfile.id,
          uiUniqueURL: userProfile.uiUniqueURL,
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
  
        const newUrl = `/${'profile'}/${response.data.UI_UniqueURL}`;
        router.replace(newUrl);
      }else{
        dispatch(
          userApi.util.invalidateTags([
            { type: 'User', id: userId },
          
          ])
        );
      }
        notify(
          'Success',
          response.message ||
            'The user information has been successfully updated.',
          'success'
        );
      }
    } catch (error: any) {
      console.error('Error editing user:', error);

      const errorMessage = error.data?.message || error.data?.detail || 'Failed to update the user information. Please try again later.';
      notify('Error', errorMessage, 'error');
    }
  };

  return {
    handleRemoveUser,
    submitEditUser,
    submitEditRoleStatus,
    submitEmailForPasswordReset,
    isResetPasswordWithLoading,
    isResetPasswordWithSuccess,
    hasResetPasswordWithError,
    resetPasswordSuccessMessage,
    submitPasswordResetWithToken,
    uiActiveUser,
    isActiveUserFetchLoading,
    activePageRefetch,
  };
};
