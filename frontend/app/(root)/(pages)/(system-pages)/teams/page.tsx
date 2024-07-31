'use client';
import { useGetUsersAssignedPositionsQuery } from '@/api/userApi';
import { pageContentPaddingStyles } from '@/styles/globals';
import { IUserBase, IUserList } from '@/types/componentInterfaces';
import { mapToIIUserList } from '@/utils/helper';
import React, { useEffect, useState } from 'react';

const Teams = () => {
  const [users, setUsers] = useState<IUserBase[]>();
  const {
    data: usersResponseData,
    isLoading: isUsersFetchLoading,
    refetch: refetchUsersList,
  } = useGetUsersAssignedPositionsQuery();

  useEffect(() => {
    if (usersResponseData && usersResponseData.data) {
      const { data } = usersResponseData;
      const usersData: IUserList = mapToIIUserList(usersResponseData.data);

      if (usersData.users) {
        setUsers(usersData?.users);
      }
    }
  }, [usersResponseData]);
  return (
    <main className="bg-pg min-h-screen">
      <div className={`${pageContentPaddingStyles}`}>Teams</div>
    </main>
  );
};

export default Teams;
