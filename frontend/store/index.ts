import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './slice/layoutSlice';
import { menuApi } from '@/api/menuApi';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    [menuApi.reducerPath]: menuApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(menuApi.middleware),
});

setupListeners(store.dispatch);

export default store;
