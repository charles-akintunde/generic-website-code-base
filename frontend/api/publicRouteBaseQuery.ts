import { setUIActiveUser } from '@/store/slice/userSlice';
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

      if (activeUserResult.data) {
        const userData = activeUserResult.data;

        console.log(userData, 'USERDATA');
        // api.dispatch(
        //   setUIActiveUser({
        //     uiFullName: `${userData.uiFirstName} ${userData.uiLastName}`,
        //     uiInitials: userData.uiFirstName[0] + userData.uiLastName[0],
        //     uiIsAdmin: userProfile.uiRole == EUserRole.Admin,
        //     uiIsSuperAdmin: userProfile.uiRole == EUserRole.SuperAdmin,
        //     uiId: userData.id,
        //     uiCanEdit:
        //       userProfile.uiRole == EUserRole.Admin ||
        //       userProfile.uiRole == EUserRole.SuperAdmin,
        //     uiRole: userProfile.uiRole,
        //     uiPhotoURL: userData.uiPhoto,
        //   })
        // );

        // Retry the original query after fetching the active user
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export default customBaseQuery;
