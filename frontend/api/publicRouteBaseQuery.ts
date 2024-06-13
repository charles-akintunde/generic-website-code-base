import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const publicRouteBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default publicRouteBaseQuery;
