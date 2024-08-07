import { IUIActiveUser, IUserBase } from '@/types/componentInterfaces';
import { EUserRole } from '@/types/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  editingUser: IUserBase | null;
  isDialogOpen: boolean;
  uiActiveUser: IUIActiveUser;
}

const initialState: UserState = {
  editingUser: null,
  isDialogOpen: false,
  uiActiveUser: {
    uiId: null,
    uiFullName: '',
    uiInitials: '',
    uiIsAdmin: false,
    uiIsSuperAdmin: false,
    uiCanEdit: false,
    uiRole: EUserRole.Public,
    uiPhotoURL: null,
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
  },
});

export const { setEditingUser, toggleCreateUserDialog, setUIActiveUser } =
  userSlice.actions;

export default userSlice.reducer;
