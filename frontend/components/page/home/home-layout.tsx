import React from 'react';
import HomeWithFooter from './home-with-footer';
import HomeWithoutFooter from './home-without-footer';
import { useUserInfo } from '../../../hooks/api-hooks/use-user-info';
import AppLoading from '../../common/app-loading';

const HomeLayout = () => {
  // const { activePageRefetch, isActiveUserFetchLoading } = useUserInfo();

  // if (isActiveUserFetchLoading) {
  //   return <AppLoading />;
  // }
  return (
    <div>
      {/* <HomeWithFooter /> */}
      <HomeWithoutFooter />
    </div>
  );
};

export default HomeLayout;
