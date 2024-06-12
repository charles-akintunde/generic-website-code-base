import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const publicRouteBaseQuery = fetchBaseQuery({
  baseUrl: process.env.API_BASE_URL,
});

export default publicRouteBaseQuery;
