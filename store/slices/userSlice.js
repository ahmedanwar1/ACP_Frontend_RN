import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null,
  userInfo: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToken: (state, { payload }) => {
      state.userToken = payload;
    },
    setUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserInfo, setUserToken } = userSlice.actions;

export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserToken = (state) => state.user.userToken;

export default userSlice.reducer;
