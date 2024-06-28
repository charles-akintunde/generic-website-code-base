import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IPageContentItem,
  IPageContentMain,
  IPageMain,
} from '@/types/componentInterfaces';

interface PageState {
  pages: IPageMain[];
  isCreatePageDialogOpen?: boolean;
  currentPage: IPageMain | null;
  currentPageContents: IPageContentItem[] | null;
  currentPageContent: IPageMain | null;
  editingPage: IPageMain | null;
  editingPageContent: IPageContentMain | null;
}

const initialState: PageState = {
  pages: [],
  isCreatePageDialogOpen: false,
  currentPageContents: null,
  editingPage: null,
  currentPageContent: null,
  currentPage: null,
  editingPageContent: null,
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
    getPageContents(state, action: PayloadAction<string>) {
      const pageName = action.payload.toLowerCase();
      const page = state.pages.find(
        (page) => page.pageName.toLowerCase() === pageName
      );

      if (page && page.pageContents) {
        state.currentPageContents = page.pageContents;
      }
    },
    getPage(state, action: PayloadAction<string>) {
      const pageName = action.payload.toLowerCase();
      const page = state.pages.find(
        (page) => page.pageName.toLowerCase() === pageName
      );

      if (page && page.pageContents) {
        state.currentPage = page;
      }
    },
    addPageContent(state, action: PayloadAction<IPageContentItem>) {
      const { pageName } = action.payload;
      const updatedPageIndex = state.pages.findIndex(
        (page) => page.pageName.toLowerCase() === pageName.toLowerCase()
      );

      if (updatedPageIndex !== -1) {
        if (!state.pages[updatedPageIndex].pageContents) {
          state.pages[updatedPageIndex].pageContents = [];
        }

        state.pages[updatedPageIndex].pageContents.push(action.payload);
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
    setEditingPageContent(
      state,
      action: PayloadAction<IPageContentMain | null>
    ) {
      state.editingPageContent = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<IPageMain | null>) {
      state.currentPage = action.payload;
    },
    setCurrentPageContent(state, action: PayloadAction<IPageMain | null>) {
      state.currentPageContent = action.payload;
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
  setEditingPageContent,
  toggleCreatePageDialog,
  setEditingPage,
  removePage,
  addPages,
  getPageContents,
  getPage,
  addPageContent,
  setCurrentPage,
  setCurrentPageContent,
} = pageSlice.actions;
export default pageSlice.reducer;
