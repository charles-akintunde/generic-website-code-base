'use client';
import {
  useDeleteUserMutation,
  useEditUserMutation,
  useEditRoleAndStatusMutation,
} from '@/api/userApi';
import { useNotification } from '@/components/hoc/notification-provider';
import { IUserBase, IUserInfo } from '@/types/componentInterfaces';
import { transformUserInfoToEditUserRequest } from '@/utils/helper';
import { ExceptionMap } from 'antd/es/result';
import useUserLogin from './use-user-login';
import { sanitizeAndCompare } from '@/app/(root)/(pages)/(system-pages)/user-profile/[user-profile-id]/page';
import { useState } from 'react';
import { useAppDispatch } from '../redux-hooks';
import { toggleCreateUserDialog } from '@/store/slice/userSlice';

export interface GetUsersRequest {
  page: number;
  limit: number;
}

const useUserInfo = () => {
  const [deleteUser] = useDeleteUserMutation();
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
  const { isAdmin, currentUser } = useUserLogin();
  const { notify } = useNotification();
  const dispatch = useAppDispatch();

  const handleRemoveUser = async (uiId: string) => {
    try {
      const response = await deleteUser(uiId).unwrap();
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

  // const submitEditRoleStatus = async ({
  //   userId: string,
  //   userInfo: IUserBase,
  //   userProfileRefetch?: () => {}
  // }) => {

  // }

  const submitEditRoleStatus = async (userId: string, userInfo: IUserBase) => {
    try {
      console.log(userInfo, 'USERINFO');
      const isSameUser = sanitizeAndCompare(
        currentUser?.Id as string,
        userInfo?.id as string
      );
      if (isAdmin && !isSameUser) {
        const response = await editRoleAndStatus({
          UI_ID: userId,
          UI_Role: Number(userInfo.uiRole),
          UI_Status: Number(userInfo.uiStatus),
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
        currentUser?.Id as string,
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
  };
};

export default useUserInfo;
