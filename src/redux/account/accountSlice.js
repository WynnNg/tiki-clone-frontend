import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    avatar: "",
    email: "",
    fullName: "",
    id: "",
    phone: "",
    role: "",
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doLogin: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    doFetchAccount: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    doLogout: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        avatar: "",
        email: "",
        fullName: "",
        id: "",
        phone: "",
        role: "",
      };
    },
    doUpdateProfile: (state, action) => {
      if (action.payload.avatar) {
        state.user.avatar = action.payload.avatar;
      }
      if (action.payload.fullName) {
        state.user.fullName = action.payload.fullName;
      }
      localStorage.removeItem("access_token");
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

export const { doLogin, doLogout, doFetchAccount, doUpdateProfile } =
  accountSlice.actions;

export default accountSlice.reducer;
