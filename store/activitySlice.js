import { createSlice } from '@reduxjs/toolkit';

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    action: null,
    date: null,
  },
  reducers: {
    setActivity: (state, action) => {
      state.action = action.payload.action;
      state.date = action.payload.date;
    },
    clearActivity: (state) => {
      state.action = null;
      state.date = null;
    }
  },
});

export const { setActivity, clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
