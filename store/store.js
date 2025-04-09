import { configureStore } from "@reduxjs/toolkit";
import userInputReducer from "./userInputSlice";
import authReducer from './authSlice';
import chatReducer from './chatSlice'
import workReducer from './workSlice';
import activityReducer from './activitySlice';
export const store = configureStore({
  reducer: {
    userInput: userInputReducer,
    auth: authReducer,
    chat: chatReducer,
    work: workReducer,
    activity:activityReducer,
  },
});
