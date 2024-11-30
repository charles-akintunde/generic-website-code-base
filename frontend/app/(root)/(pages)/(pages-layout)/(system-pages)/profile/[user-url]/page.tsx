'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserProfileForm } from '../../../../../../../components/common/form/user-profile-form';
import {
  UserOutlined,
  HomeOutlined,
  BankOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Empty, Spin, Tooltip } from 'antd';
import { useGetUserQuery, userApi } from '../../../../../../../api/userApi';
import {
  formatDate,
  handleRoutingOnError,
  isValidUUID,
  roleBadgeClasses,
  statusBadgeClasses,
  transformToUserInfo,
  transformUserPageContent,
  userRoleLabels,
  userStatusLabels,
} from '../../../../../../../utils/helper';
import {
  IPageContentMain,
  IUserInfo,
  IUserPageContent,
} from '../../../../../../../types/componentInterfaces';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AppLoading from '../../../../../../../components/common/app-loading';
import {
  useAppSelector,
} from '../../../../../../../hooks/redux-hooks';
import { PageContentCarouselCard } from '../../../../../../../components/common/carousel/page-content-carousel';
import { containerNoFlexPaddingStyles, userProfilePaddingStyles } from '../../../../../../../styles/globals';
import { Pagination } from 'antd';
export function sanitizeAndCompare(str1: string, str2: string) {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}



const UserProfilePage = () => {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0); 
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiIsAdmin = uiActiveUser ? uiActiveUser.uiIsAdmin : false;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const userURL = pathname.split('/')[2];
  const [isEditing, setIsEditing] = useState(false);
  const userQueryResult = useGetUserQuery({
          UI_UniqueURL: userURL,
          PG_PageNumber: pageNumber,
          PG_PageOffset: 10,
        });
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
  const [pageContents, setPageContents] = useState<IPageContentMain[]>([]);

  useEffect(() => {
    if (userData?.data) {
      const userPageContentResponse: IUserPageContent =  transformUserPageContent(userData?.data);
      const userInfo = userPageContentResponse?.user;
      const userPageContents = userPageContentResponse.user.uiUserPageContents;
      setTotalPages(userPageContentResponse.totalPageContent);
      setUserInfo(userInfo);
      setPageContents(userPageContents as IPageContentMain[]);
      const isSameUser = sanitizeAndCompare(
        uiActiveUser?.uiId as string,
        userInfo?.id
      );
      setIsSameUser(isSameUser);

    }
  }, [userData, isUserFetchLoading]);


  useEffect(() => {
    handleRoutingOnError(router, hasUserFetchError, userFetchError);
  }, [hasUserFetchError, router, userFetchError]);

  if (isUserFetchLoading || !userInfo) {
    return <AppLoading />;
  }

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };


  return (
    <>
      {userInfo && (
        <div className='bg-pg'>
             <div className={`py-10 text-sm  px-6 ${containerNoFlexPaddingStyles}`}>
          <div className={`${containerNoFlexPaddingStyles} p-6 bg-white shadow-sm rounded-md`}>
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
                  <h1 className="text-3xl font-bold text-gray-900">
              {`${userInfo.uiPrefix ? userInfo.uiPrefix + ' ' : ''}${userInfo.uiFirstName} ${userInfo.uiLastName}${userInfo.uiSuffix ? ', ' + userInfo.uiSuffix : ''}`}
            </h1>

                  </Tooltip>
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
                            userInfo.uiRole as unknown as keyof typeof userRoleLabels
                          ]
                        }
                        color={
                          roleBadgeClasses[
                            userInfo.uiRole as unknown as keyof typeof roleBadgeClasses
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
                      {userInfo.uiCity && userInfo.uiCity?.trim()
                        ? `${userInfo.uiCity}, `
                        : ''}
                      {userInfo.uiProvince && userInfo.uiProvince.trim()
                        ? `${userInfo.uiProvince}, `
                        : ''}
                      {userInfo.uiCountry && userInfo.uiCountry.trim()}
                    </p>
                  )}

                  {userInfo.uiPhoneNumber && userInfo.uiPhoneNumber.trim() && (
                    <p className="flex items-center">
                      <PhoneOutlined className="mr-2 text-primary" />
                      {userInfo.uiPhoneNumber}
                    </p>
                  )}

                  {(uiIsAdmin || isSameUser) && (
                    <p className="flex items-center">
                      <CalendarOutlined className="mr-2 text-primary" />
                      <span className="font-semibold mr-1 text-gray-700">
                        Registered:
                      </span>
                      {formatDate(userInfo.uiRegDate)}
                    </p>
                  )}
                  <div>
                    {userInfo.uiOrganization &&
                      userInfo.uiOrganization.trim() && (
                        <p className="flex items-center">
                          <BankOutlined className="mr-2 text-primary" />
                          <span className="font-semibold mr-1 text-gray-700">
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
            </div>

            <section className="mt-10">
              <UserProfileForm userInfo={userInfo} />
            </section>
          </div>
          <section className={`${containerNoFlexPaddingStyles}  mt-6 `}>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Related Posts
            </h2>
            {!pageContents || pageContents.length == 0 ? (
              <Empty
                description="No content available"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {pageContents.map((pageContent) => (
                    <PageContentCarouselCard
                      pageContent={pageContent}
                      key={pageContent.pageContentId}
                    />
                  ))}
                </div>
           
                <Pagination
        current={pageNumber}
        total={totalPages}
        pageSize={10}
        onChange={handlePageChange}
        className="mt-4 text-center"
      />

              </>
            )}{' '}
          </section>
          
          
        </div>
        </div>
     
      )}
    </>
  );
};

export default UserProfilePage;
