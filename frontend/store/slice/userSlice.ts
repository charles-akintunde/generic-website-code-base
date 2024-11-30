import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUIActiveUser, IUserBase } from '../../types/componentInterfaces';
import { EUserRole } from '../../types/enums';

interface IUIActiveUserProfileEdit {
  uiIsUserEditingMode: boolean;
  uiEditorInProfileMode: boolean; 
  uiIsAdminInEditingMode: boolean;
  uiIsPageContentEditingMode: boolean
}

interface UserState {
  editingUser: IUserBase | null;
  isDialogOpen: boolean;
  uiActiveUser: IUIActiveUser;
  uiActiveUserProfileEdit: {
    uiIsUserEditingMode: boolean;
    uiEditorInProfileMode: boolean;
    uiIsAdminInEditingMode: boolean ;
    uiIsPageContentEditingMode: boolean;
  };
}

const initialState: UserState = {
  editingUser: null,
  isDialogOpen: false,
  uiActiveUser: {
    uiId: null,
    uiUniqueURL: '',
    uiFullName: '',
    uiInitials: '',
    uiIsLoading: true,
    uiIsAdmin: false,
    uiIsSuperAdmin: false,
    uiCanEdit: false,
    uiRole: [EUserRole.Public],
    uiPhotoURL: null,
  },
  uiActiveUserProfileEdit: {
    uiIsUserEditingMode: false,
    uiEditorInProfileMode: false,
    uiIsAdminInEditingMode: false,
    uiIsPageContentEditingMode: false
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setEditingUser(state, action: PayloadAction<IUserBase | null>) {
      state.editingUser = action.payload;
    },
    toggleCreateUserDialog(state) {
      state.isDialogOpen = !state.isDialogOpen;
    },
    setUIActiveUser(state, action: PayloadAction<IUIActiveUser>) {
      state.uiActiveUser = action.payload;
    },
    setUIIsUserEditingMode(
      state,
      action: PayloadAction<IUIActiveUserProfileEdit>
    ) {
      state.uiActiveUserProfileEdit = action.payload;
    },
  },
});

export const {
  setEditingUser,
  toggleCreateUserDialog,
  setUIActiveUser,
  setUIIsUserEditingMode,
} = userSlice.actions;

export default userSlice.reducer;
