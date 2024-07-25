import { IUserBase } from '@/types/componentInterfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  editingUser: IUserBase | null;
  isDialogOpen: boolean;
}

const initialState: UserState = {
  editingUser: null,
  isDialogOpen: false,
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
  },
});

export const { setEditingUser, toggleCreateUserDialog } = userSlice.actions;

export default userSlice.reducer;
