'use client';
import React, { useEffect, useState } from 'react';
import {
  UserProfileDialog,
  UserRoleStatusDialog,
} from '@/components/common/form/user-profile-form';
import {
  UserOutlined,
  HomeOutlined,
  BankOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Avatar, Divider, Badge, Tooltip } from 'antd';
import { useGetUserQuery } from '@/api/userApi';
import {
  formatDate,
  handleRoutingOnError,
  isValidUUID,
  roleBadgeClasses,
  statusBadgeClasses,
  transformToUserInfo,
  userRoleLabels,
  userStatusLabels,
} from '@/utils/helper';
import { IUserInfo } from '@/types/componentInterfaces';
import { usePathname, useRouter } from 'next/navigation';
import AppLoading from '@/components/common/app-loading';
import { useAppSelector } from '@/hooks/redux-hooks';

export function sanitizeAndCompare(str1: string, str2: string) {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

const UserProfilePage = () => {
  const router = useRouter();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiIsAdmin = uiActiveUser ? uiActiveUser.uiIsAdmin : false;
  const pathname = usePathname();
  const userId = pathname.split('/')[2];

  const [isEditing, setIsEditing] = useState(false);
  const userQueryResult =
    userId && isValidUUID(userId)
      ? useGetUserQuery(userId)
      : {
          data: undefined,
          isError: true,
          isSuccess: false,
          isLoading: false,
          refetch: () => Promise.resolve({}),
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
    sanitizeAndCompare(uiActiveUser?.uiId as string, userInfo?.id as string)
  );

  useEffect(() => {
    if (userData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(userData?.data);
      setUserInfo(userProfile);

      const isSameUser = sanitizeAndCompare(
        uiActiveUser?.uiId as string,
        userProfile?.id
      );
      setIsSameUser(isSameUser);
    }
  }, [userData]);

  useEffect(() => {
    handleRoutingOnError(router, hasUserFetchError, userFetchError);
  }, [hasUserFetchError, router, userFetchError]);

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
                  {(uiIsAdmin || isSameUser) && (
                    <div className="flex space-x-2">
                      <Badge
                        text={
                          userRoleLabels[
                            userInfo.uiRole as keyof typeof userRoleLabels
                          ]
                        }
                        color={
                          roleBadgeClasses[
                            userInfo.uiRole as keyof typeof roleBadgeClasses
                          ]
                        }
                        className="mr-2"
                      />
                      <Badge
                        text={
                          userStatusLabels[
                            userInfo.uiStatus as keyof typeof userStatusLabels
                          ]
                        }
                        color={
                          statusBadgeClasses[
                            userInfo.uiStatus as keyof typeof statusBadgeClasses
                          ]
                        }
                        className="mr-2"
                      />
                    </div>
                  )}
                  {!userInfo.uiCity &&
                  !userInfo.uiProvince &&
                  !userInfo.uiCountry ? (
                    ''
                  ) : (
                    <p className="flex items-center">
                      <HomeOutlined className="mr-2 text-primary" />
                      {userInfo.uiCity ? `${userInfo.uiCity}, ` : ''}
                      {userInfo.uiProvince ? `${userInfo.uiProvince}, ` : ''}
                      {userInfo.uiCountry}
                    </p>
                  )}

                  {userInfo.uiPhoneNumber && (
                    <p className="flex items-center">
                      <PhoneOutlined className="mr-2 text-primary" />
                      {userInfo.uiPhoneNumber}
                    </p>
                  )}

                  {(uiIsAdmin || isSameUser) && (
                    <p className="flex items-center">
                      <CalendarOutlined className="mr-2 text-primary" />
                      <span className="font-semibold text-gray-700">
                        Registered:
                      </span>
                      {formatDate(userInfo.uiRegDate)}
                    </p>
                  )}
                  {userInfo.uiOrganization && (
                    <p className="flex items-center">
                      <BankOutlined className="mr-2 text-primary" />
                      <span className="font-semibold text-gray-700">
                        Organization:
                      </span>
                      <span className="capitalize">
                        {userInfo.uiOrganization}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {userInfo.uiAbout && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-900">
                  About Me
                </h2>
                <Divider className="my-6" />
                <div className="mt-4">
                  <p className="mt-2 leading-relaxed text-gray-700">
                    {userInfo.uiAbout}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;
