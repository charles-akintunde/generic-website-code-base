import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './slice/layoutSlice';

const store = configureStore({
  reducer: {
    layout: layoutReducer,
  },
});

export default store;
