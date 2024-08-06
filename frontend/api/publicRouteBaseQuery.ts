import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const publicRouteBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const shouldIncludeToken = true;
    if (shouldIncludeToken) {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        headers.set('x-refresh-token', refreshToken);
      }
    }
    return headers;
  },
});
export default publicRouteBaseQuery;
