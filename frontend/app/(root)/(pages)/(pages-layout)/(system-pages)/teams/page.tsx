'use client';
import { useGetUsersAssignedPositionsQuery } from '../../../../../../api/userApi';
import {
  IUserBase,
  IUserList,
} from '../../../../../../types/componentInterfaces';
import {
  mapToIIUserList,
  MemberPositionTitles,
} from '../../../../../../utils/helper';
import React, { useEffect, useState } from 'react';
import { Row, Avatar, Typography, Divider, Tooltip, Empty } from 'antd';
import Link from 'next/link';
import AppLoading from '../../../../../../components/common/app-loading';
import backgroundImage from '../../../../../../assets/images/page-list-img1.jpg';
import Image from 'next/image';
import { EUserRole } from '../../../../../../types/enums';
import { containerNoFlexPaddingStyles } from '../../../../../../styles/globals';

const { Title } = Typography;

const EMemberPosition = {
  Director: '0',
  PostDoc: '1',
  Phd: '2',
  Master: '3',
  Undergrad: '4',
  Alumni: '5',
  PrincipalInvestigator: '6',
  Applicant: '7',
  CoApplicant: '8',
  ResearchManager: '9',
  ResearchAssistant: '10',
  ResearchAssociate: '11',
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
    [EMemberPosition.PrincipalInvestigator]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.PrincipalInvestigator &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.Applicant]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.Applicant &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.CoApplicant]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.CoApplicant &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.ResearchManager]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.ResearchManager &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.ResearchAssistant]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.ResearchAssistant &&
        !user.uiRole.includes(EUserRole.Alumni)
    ),
    [EMemberPosition.ResearchAssociate]: users?.filter(
      (user) =>
        user.uiMemberPosition === EMemberPosition.ResearchAssociate &&
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
    const fullName = `${user.uiFirstName} ${user.uiLastName}`;
    const transformedName = fullName
    .toLowerCase() 
    .replace(/\s+/g, '-');
    const userUrl = `${transformedName}?id=${user.id}`
    const isAlumni = user.uiRole.includes(EUserRole.Alumni);
    // @ts-ignore
    const positionTitle = isAlumni
      ? // @ts-ignore
        MemberPositionTitles[user.uiMemberPosition as EMemberPosition]
      : '';

    return (
      <div key={user.uiEmail} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
        <Link href={`profile/${userUrl}`}>
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
      <div className={`${containerNoFlexPaddingStyles}`}>
        {users && users.length > 0 ? (
          <>
            {groupedUsers[EMemberPosition.Director] &&
              groupedUsers[EMemberPosition.Director].length > 0 && (
                <section className="mb-12 mt-20">
                  <Title level={3} className="text-center mb-6 text-primary">
                    Director
                  </Title>
                  <Row gutter={[16, 16]} className="flex justify-center">
                    {groupedUsers[EMemberPosition.Director]?.map(
                      renderUserCard
                    )}
                  </Row>
                </section>
              )}

            {groupedUsers[EMemberPosition.PostDoc] &&
              groupedUsers[EMemberPosition.PostDoc].length > 0 && (
                <section className="mb-12">
                  <Title level={3} className="text-center mb-6 text-primary">
                    <Divider>Postdoctoral Research Associate & Fellow</Divider>
                  </Title>
                  <Row gutter={[16, 16]} className="flex justify-center">
                    {groupedUsers[EMemberPosition.PostDoc]?.map(renderUserCard)}
                  </Row>
                </section>
              )}

  {groupedUsers[EMemberPosition.PrincipalInvestigator] &&
      groupedUsers[EMemberPosition.PrincipalInvestigator].length > 0 && (
        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Principal Investigators</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.PrincipalInvestigator]?.map(renderUserCard)}
          </Row>
        </section>
      )}

    {groupedUsers[EMemberPosition.Applicant] &&
      groupedUsers[EMemberPosition.Applicant].length > 0 && (
        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Applicants</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.Applicant]?.map(renderUserCard)}
          </Row>
        </section>
      )}

    {groupedUsers[EMemberPosition.CoApplicant] &&
      groupedUsers[EMemberPosition.CoApplicant].length > 0 && (
        <section className="mb-12">
          <Title level={3} className="text-center mb-6 text-primary">
            <Divider>Co-Applicants</Divider>
          </Title>
          <Row gutter={[16, 16]} className="flex justify-center">
            {groupedUsers[EMemberPosition.CoApplicant]?.map(renderUserCard)}
          </Row>
        </section>
      )}

      {groupedUsers[EMemberPosition.ResearchManager] &&
        groupedUsers[EMemberPosition.ResearchManager].length > 0 && (
          <section className="mb-12">
            <Title level={3} className="text-center mb-6 text-primary">
              <Divider>Research Managers</Divider>
            </Title>
            <Row gutter={[16, 16]} className="flex justify-center">
              {groupedUsers[EMemberPosition.ResearchManager]?.map(renderUserCard)}
            </Row>
          </section>
        )}

      {groupedUsers[EMemberPosition.ResearchAssistant] &&
        groupedUsers[EMemberPosition.ResearchAssistant].length > 0 && (
          <section className="mb-12">
            <Title level={3} className="text-center mb-6 text-primary">
              <Divider>Research Assistants</Divider>
            </Title>
            <Row gutter={[16, 16]} className="flex justify-center">
              {groupedUsers[EMemberPosition.ResearchAssistant]?.map(renderUserCard)}
            </Row>
          </section>
        )}

      {groupedUsers[EMemberPosition.ResearchAssociate] &&
        groupedUsers[EMemberPosition.ResearchAssociate].length > 0 && (
          <section className="mb-12">
            <Title level={3} className="text-center mb-6 text-primary">
              <Divider>Research Associates</Divider>
            </Title>
            <Row gutter={[16, 16]} className="flex justify-center">
              {groupedUsers[EMemberPosition.ResearchAssociate]?.map(renderUserCard)}
            </Row>
          </section>
        )}

            {groupedUsers[EMemberPosition.Phd] &&
              groupedUsers[EMemberPosition.Phd].length > 0 && (
                <section className="mb-12">
                  <Title level={3} className="text-center mb-6 text-primary">
                    <Divider>PhD Students</Divider>
                  </Title>
                  <Row gutter={[16, 16]} className="flex justify-center ">
                    {groupedUsers[EMemberPosition.Phd]?.map(renderUserCard)}
                  </Row>
                </section>
              )}

            {groupedUsers[EMemberPosition.Master] &&
              groupedUsers[EMemberPosition.Master].length > 0 && (
                <section className="mb-12">
                  <Title level={3} className="text-center mb-6 text-primary">
                    <Divider>Master Students</Divider>
                  </Title>
                  <Row gutter={[16, 16]} className="flex justify-center">
                    {groupedUsers[EMemberPosition.Master]?.map(renderUserCard)}
                  </Row>
                </section>
              )}

            {groupedUsers[EMemberPosition.Undergrad] &&
              groupedUsers[EMemberPosition.Undergrad].length > 0 && (
                <section className="mb-12">
                  <Title level={3} className="text-center mb-6 text-primary">
                    <Divider>Undergraduate Students</Divider>
                  </Title>
                  <Row gutter={[16, 16]} className="flex justify-center">
                    {groupedUsers[EMemberPosition.Undergrad]?.map(
                      renderUserCard
                    )}
                  </Row>
                </section>
              )}

            {groupedUsers[EMemberPosition.Alumni] &&
              groupedUsers[EMemberPosition.Alumni].length > 0 && (
                <section className="mb-12">
                  <Title level={3} className="text-center mb-6 text-primary">
                    <Divider>Alumni</Divider>
                  </Title>
                  <Row gutter={[16, 16]} className="flex justify-center">
                    {groupedUsers[EMemberPosition.Alumni]?.map(renderUserCard)}
                  </Row>
                </section>
              )}
          </>
        ) : (
          <Empty
            description="No team members available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </main>
  );
};

export default Teams;
