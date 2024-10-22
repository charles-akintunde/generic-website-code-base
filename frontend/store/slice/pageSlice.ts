import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IPageMain,
  IFetchedPage,
  IFetchedSinglePage,
  IPageContentItem,
  IPageContentMain,
} from '../../types/componentInterfaces';
interface ICurrentUserPage {
  pageId?: string | null;
  pageType?: string | null;
  pageName?: string | null;
  pageDisplayURL?: string | null;
  isModalOpen: boolean;
  isEditingMode?: boolean;
  pageContent?: IPageContentMain | null;
}

export interface IPageContentRecord extends IPageContentItem {
  pageContentId: string;
  pageContentLastUpdatedAt?: string;
  pageContentCreatedAt?: string;
  pageContentExcerpt?: string;
  pageContentReadingTime?: string;
  creatorFullName?: string;
  deleted?: boolean;
}

interface PageState {
  pages: IPageMain[];
  currentUserPage: ICurrentUserPage | null;
  isCreatePageDialogOpen?: boolean;
  currentPage: IPageMain | null;
  currentPageContents: IPageContentItem[] | null;
  currentPageContent: IPageMain | null;
  editingPage: IPageMain | null;
  editingPageContent: IPageContentMain | null;
  pageContentImageURL: string;
  fetchingPageData: IFetchedPage | null;
  pageContents: IPageContentRecord[] | [];
  fetchedSinglePageData: IFetchedSinglePage | null;
}

const initialState: PageState = {
  pages: [],
  currentUserPage: {
    isModalOpen: false,
  },
  isCreatePageDialogOpen: false,
  currentPageContents: null,
  editingPage: null,
  currentPageContent: null,
  currentPage: null,
  editingPageContent: null,
  pageContentImageURL: '',
  fetchingPageData: {
    fetchedPage: null,
    isPageFetchLoading: true,
    hasPageFetchError: false,
    pageFetchError: undefined,
  },
  fetchedSinglePageData: {
    fetchedPage: null,
    isPageFetchLoading: true,
    hasPageFetchError: false,
    pageFetchError: undefined,
  },
  pageContents: [],
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
    setCurrentUserPage(state, action: PayloadAction<ICurrentUserPage>) {
      state.currentUserPage = action.payload;
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

        state.pages[updatedPageIndex].pageContents.push(action.payload as any);
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
    setFecthingPageData(state, action: PayloadAction<IFetchedPage | null>) {
      state.fetchingPageData = action.payload;
    },
    setFetchedSinglePageData(
      state,
      action: PayloadAction<IFetchedSinglePage | null>
    ) {
      state.fetchedSinglePageData = action.payload;
    },
    setPageContents: (state, action: PayloadAction<IPageContentMain[]>) => {
      state.pageContents = action.payload;
    },
    // addPageContents: (state, action: PayloadAction<IPageContentMain[]>) => {
    //   const newContents = action.payload;
    //   const existingIds = new Set(
    //     state.pageContents.map((content) => content.pageContentId)
    //   );
    //   const uniqueNewContents = newContents.filter(
    //     (content) => !existingIds.has(content.pageContentId)
    //   );
    //   state.pageContents.push(...uniqueNewContents);
    // },
    removePageContent: (state, action: PayloadAction<string>) => {
      const existingIndex = state.pageContents.findIndex(
        (content) => content.pageContentId === action.payload
      );

      if (existingIndex !== -1) {
        state.pageContents[existingIndex].deleted = true;
      }

      console.log('FLAGGED AS DELETED');
    },
    addPageContents: (state, action: PayloadAction<IPageContentRecord[]>) => {
      const newContents = action.payload;

      newContents.forEach((newContent) => {
        const existingIndex = state.pageContents.findIndex(
          (content) => content.pageContentId === newContent.pageContentId
        );

        if (existingIndex !== -1) {
          const existingContent = state.pageContents[existingIndex];

          const hasChanged = Object.keys(newContent).some((key) => {
            return (newContent as any)[key] !== (existingContent as any)[key];
          });

          if (hasChanged) {
            state.pageContents[existingIndex] = {
              ...newContent,
              deleted: existingContent.deleted || false,
            };
          }
        } else {
          state.pageContents.push({ ...newContent, deleted: false } as never);
        }
      });
    },

    // setFecthingContentData(state, action: PayloadAction<IPageContentMain[]>) {
    //   const latestData = action.payload;
    //   const currentContents = state.fetchedPageContents || [];
    //   const newPageContents = [...latestData, ...currentContents];
    //   state.fetchedPageContents = newPageContents;
    // },

    // setFecthingPageData(state, action: PayloadAction<IFetchedPage | null>) {
    //   const latestData = action.payload;

    //   const currentContents =
    //     state.fetchingPageData?.fetchedPage?.pageContents || [];
    //   const latestContents = latestData?.fetchedPage?.pageContents || [];

    //   const newFetchedPage = latestData?.fetchedPage
    //     ? {
    //         ...latestData.fetchedPage,
    //         pageContents: [...currentContents, ...latestContents],
    //       }
    //     : state.fetchingPageData?.fetchedPage || null;

    //   const newFetchedPageData: IFetchedPage = {
    //     fetchedPage: newFetchedPage,
    //     isPageFetchLoading: latestData?.isPageFetchLoading ?? false,
    //     hasPageFetchError: latestData?.hasPageFetchError ?? false,
    //     pageFetchError: latestData?.pageFetchError,
    //   };

    //   state.fetchingPageData = newFetchedPageData;
    // },
    setPageContentImageURL(state, action: PayloadAction<string>) {
      state.pageContentImageURL = action.payload;
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
    addPageContent1: (state, action: PayloadAction<IPageContentMain>) => {
      const newContent = action.payload;

      const existingIndex = state.pageContents.findIndex(
        (content) => content.pageContentId === newContent.pageContentId
      );

      if (existingIndex !== -1) {
        const existingContent = state.pageContents[existingIndex];
        const hasChanged = Object.keys(newContent).some((key) => {
          return (newContent as any)[key] !== (existingContent as any)[key];
        });

        if (hasChanged) {
          state.pageContents[existingIndex] = newContent;
        }
      } else {
        state.pageContents.push(newContent as never);
      }
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
  setFecthingPageData,
  setPageContentImageURL,
  setCurrentUserPage,
  setFetchedSinglePageData,
  setPageContents,
  addPageContents,
  addPageContent1,
  removePageContent,
} = pageSlice.actions;
export default pageSlice.reducer;
