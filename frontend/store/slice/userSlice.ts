import { IUserBase } from '@/types/componentInterfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  editingUser: IUserBase | null;
}

const initialState: UserState = {
  editingUser: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setEditingUser(state, action: PayloadAction<IUserBase | null>) {
      state.editingUser = action.payload;
    },
  },
});

export const { setEditingUser } = userSlice.actions;

export default userSlice.reducer;
