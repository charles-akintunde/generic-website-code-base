import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
});

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh-token',
        method: 'POST',
        credentials: 'include',
      },
      api,
      extraOptions
    );

    const activeUserResult = await baseQuery(
      {
        url: 'auth/active-user',
        method: 'GET',
        credentials: 'include',
      },
      api,
      extraOptions
    );

    // if (activeUserResult.data) {
    //   const userProfile: IUserInfo = transformToUserInfo(activeUserResult.data);

    //   api.dispatch(
    //     setUIActiveUser({
    //       uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
    //       uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
    //       uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
    //       uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
    //       uiId: userProfile.id,
    //       uiCanEdit:
    //         userProfile.uiRole.includes(EUserRole.Admin) ||
    //         userProfile.uiRole.includes(EUserRole.SuperAdmin),
    //       uiRole: userProfile.uiRole,
    //       uiPhotoURL: userProfile.uiPhoto,
    //     })
    //   );
    // }
    // console.log(activeUserResult, 'activeUserResulttttttttttttttttttttttt');

    if (refreshResult) {
      result = await baseQuery(args, api, extraOptions);

      const activeUserResult = await baseQuery(
        {
          url: 'auth/active-user',
          method: 'GET',
          credentials: 'include',
        },
        api,
        extraOptions
      );

      // if (activeUserResult.data) {
      //   const userProfile: IUserInfo = transformToUserInfo(
      //     activeUserResult.data
      //   );

      //   api.dispatch(
      //     setUIActiveUser({
      //       uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
      //       uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
      //       uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
      //       uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
      //       uiId: userProfile.id,
      //       uiCanEdit:
      //         userProfile.uiRole.includes(EUserRole.Admin) ||
      //         userProfile.uiRole.includes(EUserRole.SuperAdmin),
      //       uiRole: userProfile.uiRole,
      //       uiPhotoURL: userProfile.uiPhoto,
      //     })
      //   );

      //   // Retry the original query after fetching the active user
      //   result = await baseQuery(args, api, extraOptions);
      // }
    }
  }

  return result;
};

export default customBaseQuery;
