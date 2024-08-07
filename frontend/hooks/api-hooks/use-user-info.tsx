'use client';
import {
  useDeleteUserMutation,
  useEditUserMutation,
  useEditRoleAndStatusMutation,
} from '@/api/userApi';
import { useNotification } from '@/components/hoc/notification-provider';
import {
  IUIActiveUser,
  IUserBase,
  IUserInfo,
} from '@/types/componentInterfaces';
import {
  transformToUserInfo,
  transformUserInfoToEditUserRequest,
} from '@/utils/helper';
import { ExceptionMap } from 'antd/es/result';
import { sanitizeAndCompare } from '@/app/(root)/(pages)/(system-pages)/user-profile/[user-profile-id]/page';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux-hooks';
import {
  setUIActiveUser,
  toggleCreateUserDialog,
} from '@/store/slice/userSlice';
import {
  useGetActiveUserQuery,
  useResetPasswordWithEmailMutation,
  useResetPasswordWithTokenMutation,
} from '@/api/authApi';
import { useRouter } from 'next/navigation';
import { EUserRole } from '@/types/enums';

export interface GetUsersRequest {
  page: number;
  limit: number;
}

const useUserInfo = () => {
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
  const [uiActiveUser, setActiveUser] = useState<IUIActiveUser>({
    uiId: null,
    uiFullName: '',
    uiInitials: '',
    uiIsAdmin: false,
    uiIsSuperAdmin: false,
    uiCanEdit: false,
    uiRole: EUserRole.Public,
    uiPhotoURL: null,
  });

  const { notify } = useNotification();
  const dispatch = useAppDispatch();
  const [resetPasswordSuccessMessage, setResetPasswordSuccessMessage] =
    useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (activeUserData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(activeUserData?.data);
      dispatch(
        setUIActiveUser({
          uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
          uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
          uiIsAdmin: userProfile.uiRole == EUserRole.Admin,
          uiIsSuperAdmin: userProfile.uiRole == EUserRole.SuperAdmin,
          uiId: userProfile.id,
          uiCanEdit:
            userProfile.uiRole == EUserRole.Admin ||
            userProfile.uiRole == EUserRole.SuperAdmin,
          uiRole: userProfile.uiRole,
          uiPhotoURL: userProfile.uiPhoto,
        })
      );
    }
  }, [activeUserData]);

  const handleRemoveUser = async (user: IUserBase) => {
    try {
      const response = await deleteUser(user.id).unwrap();
      notify(
        'Success',
        response.message || 'The page has been successfully deleted.',
        'success'
      );
    } catch (error: any) {
      console.log(error, 'ERROR');
      notify(
        'Error',
        error.data.message ||
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

      console.log(response, 'RESONSE');

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

      console.log(error, 'ERROR ');

      // const errorMessage =
      //   error.data?.message || error.data?.detail || defaultErrorMessage;
      // notify('Error', errorMessage, 'error');
    }
  };

  const submitEditRoleStatus = async (userId: string, userInfo: IUserBase) => {
    try {
      const isSameUser = sanitizeAndCompare(
        uiActiveUser?.uiId as string,
        userInfo?.id as string
      );
      if (uiActiveUser.uiIsSuperAdmin && !isSameUser) {
        const response = await editRoleAndStatus({
          UI_ID: userId,
          UI_Role: Number(userInfo.uiRole),
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
    userInfo: IUserInfo,
    userProfileRefetch?: () => {}
  ) => {
    try {
      userInfo['id'] = userId;
      const isSameUser = sanitizeAndCompare(
        uiActiveUser?.uiId as string,
        userInfo?.id as string
      );
      const formData = new FormData();

      if (userInfo.uiFirstName) {
        formData.append('UI_FirstName', userInfo.uiFirstName);
      }

      if (userInfo.uiLastName) {
        formData.append('UI_LastName', userInfo.uiLastName);
      }
      if (userInfo.uiPhoto) {
        formData.append('UI_Photo', userInfo.uiPhoto);
      }
      if (userInfo.uiCity) {
        formData.append('UI_City', userInfo.uiCity);
      }
      if (userInfo.uiProvince) {
        formData.append('UI_Province', userInfo.uiProvince);
      }
      if (userInfo.uiCountry) {
        formData.append('UI_Country', userInfo.uiCountry);
      }
      if (userInfo.uiPostalCode) {
        formData.append('UI_PostalCode', userInfo.uiPostalCode);
      }
      if (userInfo.uiPhoneNumber) {
        formData.append('UI_PhoneNumber', userInfo.uiPhoneNumber);
      }
      if (userInfo.uiOrganization) {
        formData.append('UI_Organization', userInfo.uiOrganization);
      }
      if (userInfo.uiAbout) {
        formData.append('UI_About', userInfo.uiAbout);
      }

      if (isSameUser) {
        const response = await editPage({
          UI_ID: userId,
          formData,
        }).unwrap();

        if (userProfileRefetch) {
          userProfileRefetch();
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

      const errorMessage =
        error.data?.message ||
        error.data?.detail ||
        'Failed to update the user information. Please try again later.';
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
    activePageRefetch,
  };
};

export default useUserInfo;
