'use client';
import { useDeleteUserMutation, useEditUserMutation } from '@/api/userApi';
import { useNotification } from '@/components/hoc/notification-provider';
import { IUserBase, IUserInfo } from '@/types/componentInterfaces';
import { transformUserInfoToEditUserRequest } from '@/utils/helper';
import { ExceptionMap } from 'antd/es/result';

export interface GetUsersRequest {
  page: number;
  limit: number;
}

const useUserInfo = () => {
  const [deleteUser] = useDeleteUserMutation();
  const [
    editPage,
    {
      isError: hasEditPageError,
      isSuccess: isEditPageSuccess,
      isLoading: isEditPageLoading,
    },
  ] = useEditUserMutation();
  const { notify } = useNotification();

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

  const handleEditUser = async (
    userId: string,
    userInfo: IUserInfo,
    userProfileRefetch: () => {}
  ) => {
    try {
      userInfo['id'] = userId;
      // const editedUserRequest = transformUserInfoToEditUserRequest(userInfo);
      // editedUserRequest.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });
      const formData = new FormData();

      if (userInfo.uiFirstName) {
        formData.append('UI_FirstName', userInfo.uiFirstName);
      }

      if (userInfo.uiLastName) {
        formData.append('UI_LastName', userInfo.uiLastName);
      }
      // if (userInfo.uiRole) {
      //   formData.append('UI_Role', userInfo.uiRole);
      // }
      // if (userInfo.uiStatus) {
      //   formData.append('UI_Status', userInfo.uiStatus);
      // }
      // if (userInfo.uiRegDate) {
      //   formData.append('UI_RegDate', userInfo.uiRegDate);
      // }
      if (userInfo.uiPhotoUrl) {
        formData.append('UI_Photo', userInfo.uiPhotoUrl);
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

      // const response = await editPage({
      //   UI_ID: userId,
      //   formData,
      // }).unwrap();

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // userProfileRefetch();
      // notify(
      //   'Success',
      //   response.message ||
      //     'The user information has been successfully updated.',
      //   'success'
      // );
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
    handleEditUser,
  };
};

export default useUserInfo;
