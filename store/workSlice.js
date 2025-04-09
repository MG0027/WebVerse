// store/workSlice.js
import { createSlice } from '@reduxjs/toolkit';

const workSlice = createSlice({
  name: 'work',
  initialState: {
    history: [], // Each item: { workId, inputs: [{ message, ... }] }
  },
  reducers: {
    setWorkHistory: (state, action) => {
      state.history = action.payload;
    },
    addToWorkHistory: (state, action) => {
      state.history.unshift(action.payload); // adds new work at the top
    },
  },
});

export const { setWorkHistory, addToWorkHistory  } = workSlice.actions;
export default workSlice.reducer;
