'use client';
import { useGetUsersAssignedPositionsQuery } from '@/api/userApi';
import { IUserBase, IUserList } from '@/types/componentInterfaces';
import { mapToIIUserList } from '@/utils/helper';
import React, { useEffect, useState } from 'react';
import { Row, Avatar, Typography, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AppLoading from '@/components/common/app-loading';
import backgroundImage from '@/assets/images/page-list-img1.jpg';
import Image from 'next/image';

const { Title, Text } = Typography;

const EMemberPosition = {
  DIRECTOR: '0',
  POSTDOC: '1',
  PHD: '2',
  MASTER: '3',
  UNDERGRAD: '4',
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

  if (isUsersFetchLoading) {
    return <AppLoading />;
  }

  const groupedUsers = {
    [EMemberPosition.DIRECTOR]: users?.filter(
      (user) => user.uiMemberPosition === EMemberPosition.DIRECTOR
    ),
    [EMemberPosition.POSTDOC]: users?.filter(
      (user) => user.uiMemberPosition === EMemberPosition.POSTDOC
    ),
    [EMemberPosition.PHD]: users?.filter(
      (user) => user.uiMemberPosition === EMemberPosition.PHD
    ),
    [EMemberPosition.MASTER]: users?.filter(
      (user) => user.uiMemberPosition === EMemberPosition.MASTER
    ),
    [EMemberPosition.UNDERGRAD]: users?.filter(
      (user) => user.uiMemberPosition === EMemberPosition.UNDERGRAD
    ),
  };

  const renderUserCard = (user: IUserBase) => {
    const avatarSize =
      user.uiMemberPosition === EMemberPosition.DIRECTOR ? 150 : 100;
    return (
      <div
        key={user.uiEmail}
        className="w-full  sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
      >
        <Link href={`user-profile/${user.id}`}>
          <div className="border rounded-lg bg-white p-6 text-center shadow-sm transform transition-transform hover:scale-104 hover:shadow-md">
            <Avatar
              size={avatarSize}
              src={user.uiPhotoUrl || <UserOutlined />}
              alt={`${user.uiFirstName} ${user.uiLastName}`}
              className="mx-auto mb-4 border border-gray-200"
            />
            <Title level={4} className="text-gray-800">
              {`${user.uiFirstName} ${user.uiLastName}`}
            </Title>
            <Text type="secondary">{user.uiEmail}</Text>
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
        <section className="mb-12">
          <Divider className="mb-8" />

          <Title level={3} className="text-center mb-6 text-primary">
            Director
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.DIRECTOR]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Postdoctoral Research Associate & Fellow</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.POSTDOC]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>PhD Students</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center ">
            {groupedUsers[EMemberPosition.PHD]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Master Students</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.MASTER]?.map(renderUserCard)}
          </Row>
        </section>

        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Undergraduate Students</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.UNDERGRAD]?.map(renderUserCard)}
          </Row>
        </section>
      </div>
    </main>
  );
};

export default Teams;
