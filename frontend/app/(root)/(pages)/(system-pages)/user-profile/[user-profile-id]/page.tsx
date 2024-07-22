'use client';
import React, { useEffect, useState } from 'react';
import UserProfileForm from '@/components/common/form/user-profile-form';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BankOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  pageContentPaddingStyles,
  userProfilePaddingStyles,
} from '@/styles/globals';
import { format } from 'date-fns';
import { Avatar, Divider, Switch, Tooltip } from 'antd';
import ActionsButtons from '@/components/common/action-buttons';
import UserProfileFormDialog from '@/components/common/form/user-profile-form';
import { Badge } from 'antd';
import { useGetUserQuery } from '@/api/userApi';
import { formatDate, transformToUserInfo } from '@/utils/helper';
import { IUserInfo } from '@/types/componentInterfaces';

const UserProfilePage = () => {
  // 4f98b31c-ae78-4e17-b6c2-883e11654446
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: userData,
    isError: hasUserFetchError,
    isSuccess: isUserFetchSuccess,
    isLoading: isUserFetchLoading,
  } = useGetUserQuery('4f98b31c-ae78-4e17-b6c2-883e11654446');
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    console.log(userData, 'userData');
    if (userData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(userData?.data);
      setUserInfo(userProfile);
      console.log(userProfile, 'userProfile');
    }
  }, [userData]);

  return (
    <>
      {userInfo && (
        <div className="pt-10 px-6 min-h-screen">
          <div
            className={`${userProfilePaddingStyles} p-6 bg-white rounded-lg shadow-sm transition-all duration-300`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 flex justify-center md:justify-start">
                <Avatar
                  size={200}
                  src={userInfo.uiPhotoUrl}
                  alt={`${userInfo.uiFirstName} ${userInfo.uiLastName}`}
                  icon={!userInfo.uiPhotoUrl && <UserOutlined />}
                  className="shadow-md"
                />
              </div>
              <div className="col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userInfo.uiFirstName} {userInfo.uiLastName}
                  </h1>
                  <div>
                    <Switch
                      size="small"
                      checked={isEditing}
                      onChange={handleEditToggle}
                      className="mr-2"
                    />{' '}
                    Edit
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 flex items-center">
                    {userInfo.uiEmail}
                  </p>
                  <div className="flex space-x-2">
                    <p className="flex  items-center">
                      <Badge status="default" className="mr-2" />{' '}
                      {userInfo.uiRole}
                    </p>
                    <p className="flex items-center">
                      {' '}
                      <Badge className="mr-2" status="success" />{' '}
                      {userInfo.uiStatus}
                    </p>
                  </div>

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
                  <p className="flex items-center">
                    <CalendarOutlined className="mr-2 text-primary" />
                    <span className="font-semibold text-gray-700">
                      Registered:
                    </span>{' '}
                    {formatDate(userInfo.uiRegDate)}
                  </p>
                  <p className="flex items-center">
                    <BankOutlined className="mr-2 text-primary" />
                    <span className="font-semibold text-gray-700">
                      Organization:
                    </span>{' '}
                    {userInfo.uiOrganization}
                  </p>
                </div>
              </div>
            </div>
            <Divider className="my-6" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">About Me</h2>
              <p className="mt-2 text-gray-700">
                [Add a brief bio or description here]
              </p>
              {isEditing && (
                <div className="mt-4">
                  {/* UserProfileForm component should be here */}
                  <UserProfileForm userInfo={userInfo} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;
