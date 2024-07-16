'use client';
import React, { useEffect, useState } from 'react';
import { useGetUsersQuery } from '@/api/userApi';
import { IUserList } from '@/types/componentInterfaces';
import { mapToIIUserList } from '@/utils/helper';

export interface GetUsersRequest {
  lastFirstName: string | null;
  lastLastName: string | null;
  lastUUID: string | null;
  limit: number;
}

const useUserInfo = ({
  lastFirstName = null,
  lastLastName = '',
  lastUUID = '',
  limit = 10,
}: GetUsersRequest) => {
  const {
    data: usersResponseData,
    isError: hasUsersFetchError,
    isSuccess: isUsersFetchSuccess,
    isLoading: isUsersFetchLoading,
  } = useGetUsersQuery({
    lastFirstName,
    lastLastName,
    lastUUID,
    limit,
  });

  const [usersData, setUsersData] = useState<IUserList>();

  console.log(usersResponseData, 'usersResponseData');

  useEffect(() => {
    if (usersResponseData && usersResponseData.data) {
      console.log(usersResponseData, 'usersResponseData');
      const users: IUserList = mapToIIUserList(usersResponseData.data);
      setUsersData(users);
      console.log(users, 'USERSSSSSSSSSS');
    }
  }, [usersData]);

  return {
    usersData,
    hasUsersFetchError,
    isUsersFetchSuccess,
    isUsersFetchLoading,
  };
};

export default useUserInfo;
