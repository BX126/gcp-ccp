import { createSlice } from '@reduxjs/toolkit';

const initialUserState = {
  email: null,
  fileName: "null",
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUserEmail(state, action) {
      state.email = action.payload;
    },
    setFileName(state, action) {
      state.fileName = action.payload;
    }
  },
});

export const { setUserEmail } = userSlice.actions;
export const { setFileName } = userSlice.actions;
export default userSlice.reducer;
