import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './slice/layoutSlice';
import pageSlice from './slice/pageSlice';
import { menuApi } from '@/api/menuApi';
import { authApi } from '@/api/authApi';
import { pageApi } from '@/api/pageApi';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    page: pageSlice,
    [menuApi.reducerPath]: menuApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [pageApi.reducerPath]: pageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      menuApi.middleware,
      authApi.middleware,
      pageApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
