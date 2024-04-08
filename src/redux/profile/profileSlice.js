import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profileTheme: "light",
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileTheme: (state, action) => {
            state.profileTheme = action.payload;
        },
    },
});

export const { setProfileTheme } = profileSlice.actions;
export default profileSlice.reducer;