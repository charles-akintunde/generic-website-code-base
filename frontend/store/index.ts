import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './slice/layoutSlice';
import pageSlice from './slice/pageSlice';
import userSlice from './slice/userSlice';
import { menuApi } from '@/api/menuApi';
import { authApi } from '@/api/authApi';
import { pageApi } from '@/api/pageApi';
import { userApi } from '@/api/userApi';
import { pageContentApi } from '@/api/pageContentApi';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    page: pageSlice,
    userSlice: userSlice,
    [menuApi.reducerPath]: menuApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [pageApi.reducerPath]: pageApi.reducer,
    [pageContentApi.reducerPath]: pageContentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(
      menuApi.middleware,
      authApi.middleware,
      pageApi.middleware,
      pageContentApi.middleware,
      userApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
