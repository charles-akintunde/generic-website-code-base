'use client';
import { useDeleteUserMutation } from '@/api/userApi';
import { useNotification } from '@/components/hoc/notification-provider';
import { IUserBase } from '@/types/componentInterfaces';
import { ExceptionMap } from 'antd/es/result';

export interface GetUsersRequest {
  page: number;
  limit: number;
}

const useUserInfo = () => {
  const [deleteUser] = useDeleteUserMutation();
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

  return {
    handleRemoveUser,
  };
};

export default useUserInfo;
