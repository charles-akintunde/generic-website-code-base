import { createSlice } from '@reduxjs/toolkit';

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    isDrawerOpen: false,
  },
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
  },
});

export const { toggleDrawer, closeDrawer } = layoutSlice.actions;
export default layoutSlice.reducer;
