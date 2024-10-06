'use client';
import { useGetUsersAssignedPositionsQuery } from '@/api/userApi';
import { IUserBase, IUserList } from '@/types/componentInterfaces';
import { mapToIIUserList, MemberPositionTitles } from '@/utils/helper';
import React, { useEffect, useState } from 'react';
import { Row, Avatar, Typography, Divider, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AppLoading from '@/components/common/app-loading';
import backgroundImage from '@/assets/images/page-list-img1.jpg';
import Image from 'next/image';
import { EUserRole } from '@/types/enums';

const { Title, Text } = Typography;

const EMemberPosition = {
  Director: '0',
  PostDoc: '1',
  Phd: '2',
  Master: '3',
  Undergrad: '4',
  Alumni: '5',
};

const Teams = () => {
  const [users, setUsers] = useState<IUserBase[]>();
  const {
    data: usersResponseData,
    isLoading: isUsersFetchLoading,
    refetch: refetchUsersList,
  } = useGetUsersAssignedPositionsQuery();

  useEffect(() => {
    if (usersResponseData && usersResponseData.data) {
      const usersData: IUserList = mapToIIUserList(usersResponseData.data);

      if (usersData.users) {
        setUsers(usersData?.users);
      }
    }
  }, [usersResponseData]);

  if (isUsersFetchLoading || !users) {
    return <AppLoading />;
  }

  const groupedUsers = {
    [EMemberPosition.Director]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.Director &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.PostDoc]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.PostDoc &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.Phd]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.Phd &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.Master]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.Master &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.Undergrad]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.Undergrad &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.Alumni]: users?.filter((user) =>
      user.uiRole.includes(EUserRole.Alumni)
    ),
  };

  const renderUserCard = (user: IUserBase) => {
    const avatarSize =
      user.uiMemberPosition === EMemberPosition.Director ? 150 : 100;
    const cardHeight =
      user.uiMemberPosition === EMemberPosition.Director ? '250px' : '200px';

    // Determine if the user is an Alumni and get their position title
    const isAlumni = user.uiRole.includes(EUserRole.Alumni);
    // @ts-ignore
    const positionTitle = isAlumni
      ? // @ts-ignore
        MemberPositionTitles[user.uiMemberPosition as EMemberPosition]
      : '';

    return (
      <div key={user.uiEmail} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
        <Link href={`user-profile/${user.id}`}>
          <div
            className="border rounded-lg bg-white p-6 text-center shadow-sm transform transition-transform hover:scale-104 hover:shadow-md"
            style={{ height: cardHeight }} // Dynamic height for the card
          >
            <Avatar
              size={avatarSize}
              // @ts-ignore
              src={user.uiPhotoUrl}
              alt={`${user.uiFirstName} ${user.uiLastName}`}
              style={{ backgroundColor: '#f9f9f9ff', color: 'black' }}
              className="mx-auto mb-4 border border-gray-200"
            >
              {user.uiInitials}
            </Avatar>

            <Tooltip
              placement="bottom"
              title={`${user.uiFirstName} ${user.uiLastName}`}
            >
              <Title level={4} className="text-gray-800 truncate text-sm">
                {`${user.uiFirstName} ${user.uiLastName}`}
              </Title>
            </Tooltip>

            {isAlumni && (
              <p className="text-gray-600 text-xs">{positionTitle}</p>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <main className="bg-pg min-h-screen p-6">
      <header className="relative w-full h-64 rounded-sm overflow-hidden">
        <Image
          src={backgroundImage}
          alt="Header Background"
          layout="fill"
          objectFit="cover"
          className="rounded-sm bg-pg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-white">
            Meet our Team
          </h1>
        </div>
      </header>
      <div className="container mx-auto">
        <section className="mb-12 mt-20">
          <Title level={3} className="text-center mb-6 text-primary">
            Director
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.Director]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Postdoctoral Research Associate & Fellow</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.PostDoc]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>PhD Students</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center ">
            {groupedUsers[EMemberPosition.Phd]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Master Students</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.Master]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Undergraduate Students</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.Undergrad]?.map(renderUserCard)}
          </Row>
        </section>
        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Alumni</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.Alumni]?.map(renderUserCard)}
          </Row>
        </section>
      </div>
    </main>
  );
};

export default Teams;
