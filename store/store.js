import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./slices/mapSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userReducer,
  },
});
