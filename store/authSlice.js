import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload; 
    },
    signOut(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
