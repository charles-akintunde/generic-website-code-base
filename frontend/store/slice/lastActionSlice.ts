import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LastActionState {
  action: string | null;
}

const initialState: LastActionState = {
  action: null,
};

const lastActionSlice = createSlice({
  name: 'lastAction',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<{ type: string }>) => {
      state.action = action.payload.type;
    },
  },
});

export const { update } = lastActionSlice.actions;
export default lastActionSlice.reducer;
