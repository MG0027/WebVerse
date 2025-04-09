import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  input: "",
};

const userInputSlice = createSlice({
  name: "userInput",
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
  },
});

export const { setInput } = userInputSlice.actions;
export default userInputSlice.reducer;
