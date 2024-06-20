import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPageMain } from '@/types/componentInterfaces';

interface PageState {
  pages: IPageMain[];
  isCreatePageDialogOpen?: boolean;
  editingPage: IPageMain | null;
}

const initialState: PageState = {
  pages: [],
  isCreatePageDialogOpen: false,
  editingPage: null,
};

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    toggleCreatePageDialog(state) {
      state.isCreatePageDialogOpen = !state.isCreatePageDialogOpen;
    },
    addPage(state, action: PayloadAction<IPageMain>) {
      const existingPage = state.pages.find(
        (page) =>
          page.pageName.toLowerCase() === action.payload.pageName.toLowerCase()
      );
      if (!existingPage) {
        state.pages.push(action.payload);
      } else {
        throw new Error('Page name already exists');
      }
    },
    addPages(state, action: PayloadAction<IPageMain[]>) {
      state.pages = action.payload;
    },
    editPage(state, action: PayloadAction<IPageMain>) {
      const updatedPageIndex = state.pages.findIndex(
        (page) =>
          page.pageName.toLowerCase() === action.payload.pageName.toLowerCase()
      );
      if (updatedPageIndex !== -1) {
        const existingPageWithSameName = state.pages.find(
          (page, index) =>
            index !== updatedPageIndex &&
            page.pageName.toLowerCase() ===
              action.payload.pageName.toLowerCase()
        );
        if (!existingPageWithSameName) {
          state.pages[updatedPageIndex] = action.payload;
        } else {
          throw new Error('Page name already exists');
        }
      }
    },
    setEditingPage(state, action: PayloadAction<IPageMain | null>) {
      state.editingPage = action.payload;
    },
    removePage(state, action: PayloadAction<IPageMain>) {
      state.pages = state.pages.filter(
        (page) => page.pageName !== action.payload.pageName
      );
    },
  },
});

export const {
  addPage,
  editPage,
  toggleCreatePageDialog,
  setEditingPage,
  removePage,
  addPages,
} = pageSlice.actions;
export default pageSlice.reducer;
