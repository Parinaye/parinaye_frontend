import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  isSubmitting: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.isAuthenticated = false;
    },
    signInSuccess: (state, action) => {
      state.isSubmitting = false;
      state.currentUser = action.payload;
      state.error = null;
      state.isAuthenticated = true;
    },
    signInFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    updateUserAtStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.isSubmitting = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    deleteUserAtStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.isSubmitting = false;
      state.currentUser = null;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    signOutAtStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    signOutSuccess: (state) => {
      state.isSubmitting = false;
      state.currentUser = null;
      state.error = null;
    },
    signOutFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateUserAtStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserAtStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutAtStart,
  signOutSuccess,
  signOutFailure,
} = userSlice.actions;

export const validateToken = () => async (dispatch) => {
  dispatch(signInStart());
  try {
    const res = await fetch("/api/auth/check_token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }
    dispatch(signInSuccess(data));
  } catch (err) {
    dispatch(signInFailure(err.message));
  }
};

export default userSlice.reducer;
