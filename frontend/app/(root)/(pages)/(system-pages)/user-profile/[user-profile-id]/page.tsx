'use client';
import React, { useEffect, useState } from 'react';
import { UserProfileDialog } from '@/components/common/form/user-profile-form';
import {
  UserOutlined,
  HomeOutlined,
  BankOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { Avatar, Divider, Badge, Tooltip } from 'antd';
import ActionsButtons from '@/components/common/action-buttons';
import { useGetUserQuery } from '@/api/userApi';
import {
  formatDate,
  isValidUUID,
  roleColors,
  statusColors,
  transformToUserInfo,
  userRoleLabels,
  userStatusLabels,
} from '@/utils/helper';
import { IUserInfo } from '@/types/componentInterfaces';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { usePathname, useRouter } from 'next/navigation';
import AppLoading from '@/components/common/app-loading';

export function sanitizeAndCompare(str1: string, str2: string) {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

const UserProfilePage = () => {
  const router = useRouter();
  const { isAdmin, currentUser } = useUserLogin();
  const pathname = usePathname();
  const userId = pathname.split('/')[2];
  console.log(pathname, userId, 'PATHNAME');

  const [isEditing, setIsEditing] = useState(false);
  const userQueryResult =
    userId && isValidUUID(userId)
      ? useGetUserQuery(userId)
      : {
          data: undefined,
          isError: true,
          isSuccess: false,
          isLoading: false,
          refetch: () => {},
          error: null,
        };

  const {
    data: userData,
    isError: hasUserFetchError,
    isSuccess: isUserFetchSuccess,
    isLoading: isUserFetchLoading,
    refetch: userProfileRefetch,
    error: userFetchError,
  } = userQueryResult;

  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  const [isSameUser, setIsSameUser] = useState(
    sanitizeAndCompare(currentUser?.Id as string, userInfo?.id as string)
  );

  useEffect(() => {
    console.log(userData, 'userData');
    if (userData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(userData?.data);
      setUserInfo(userProfile);

      const isSameUser = sanitizeAndCompare(
        currentUser?.Id as string,
        userProfile?.id
      );
      setIsSameUser(isSameUser);
    }
  }, [userData]);

  console.log(hasUserFetchError, 'hasUserFetchError');

  useEffect(() => {
    if (hasUserFetchError) {
      router.replace('/404');
    }
  }, [hasUserFetchError, router]);

  if (isUserFetchLoading) {
    return <AppLoading />;
  }

  return (
    <>
      {userInfo && (
        <div className="pt-10 text-sm bg-pg px-6 min-h-screen">
          <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 flex justify-center md:justify-start">
                <Avatar
                  size={200}
                  src={userInfo.uiPhoto as string}
                  alt={`${userInfo.uiFirstName} ${userInfo.uiLastName}`}
                  icon={!userInfo.uiPhoto && <UserOutlined />}
                  className="shadow-lg"
                />
              </div>
              <div className="col-span-3">
                <div className="flex justify-between items-center mb-6">
                  <Tooltip
                    title={`${userInfo.uiFirstName} ${userInfo.uiLastName}`}
                  >
                    <h1 className="text-3xl font-bold text-gray-900">{`${userInfo.uiFirstName} ${userInfo.uiLastName}`}</h1>
                  </Tooltip>
                  <div className="flex items-center">
                    {isSameUser && (
                      <UserProfileDialog
                        userProfileRefetch={userProfileRefetch}
                        userInfo={userInfo}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 flex items-center">
                    <MailOutlined className="mr-2 text-primary" />
                    {userInfo.uiEmail}
                  </p>
                  {(isAdmin || isSameUser) && (
                    <div className="flex space-x-2">
                      <Badge
                        text={userRoleLabels[userInfo.uiRole]}
                        color={roleColors[userInfo.uiRole]}
                        className="mr-2"
                      />
                      <Badge
                        text={userStatusLabels[userInfo.uiStatus]}
                        color={statusColors[userInfo.uiStatus]}
                        className="mr-2"
                      />
                    </div>
                  )}
                  <p className="flex items-center">
                    <HomeOutlined className="mr-2 text-primary" />
                    {userInfo.uiCity ? `${userInfo.uiCity}, ` : ''}
                    {userInfo.uiProvince ? `${userInfo.uiProvince}, ` : ''}
                    {userInfo.uiCountry}
                  </p>
                  <p className="flex items-center">
                    <PhoneOutlined className="mr-2 text-primary" />
                    {userInfo.uiPhoneNumber}
                  </p>
                  {(isAdmin || isSameUser) && (
                    <p className="flex items-center">
                      <CalendarOutlined className="mr-2 text-primary" />
                      <span className="font-semibold text-gray-700">
                        Registered:
                      </span>
                      {formatDate(userInfo.uiRegDate)}
                    </p>
                  )}
                  <p className="flex items-center">
                    <BankOutlined className="mr-2 text-primary" />
                    <span className="font-semibold text-gray-700">
                      Organization:
                    </span>
                    <span className="capitalize">
                      {userInfo.uiOrganization}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900">About Me</h2>
              <Divider className="my-6" />
              <div className="mt-4">
                {/* UserProfileForm component should be here */}
                <p className="mt-2 leading-relaxed text-gray-700">
                  {userInfo.uiAbout}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;
