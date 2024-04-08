import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profileTheme: "light",
    resetPasswordToken: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileTheme: (state, action) => {
            state.profileTheme = action.payload;
        },
        setResetPasswordToken: (state, action) => {
            state.resetPasswordToken = action.payload;
        }
    },
});

export const { setProfileTheme , setResetPasswordToken} = profileSlice.actions;
export default profileSlice.reducer;