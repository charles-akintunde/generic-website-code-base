import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPageMain } from '@/types/componentInterfaces';

interface PageState {
  pages: IPageMain[];
}

const initialState: PageState = {
  pages: [],
};

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    addPage(state, action: PayloadAction<IPageMain>) {
      state.pages.push(action.payload);
    },
  },
});

export const { addPage } = pageSlice.actions;
export default pageSlice.reducer;
