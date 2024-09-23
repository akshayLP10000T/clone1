import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedusers: [],
        userProfile: null,
        selectedUser: null
    },
    reducers: {
        setAuthUser: (state, action)=>{
            state.user = action.payload;
        },
        setSuggestedUser: (state, action)=>{
            state.suggestedusers = action.payload;
        },
        setUserProfile: (state, action)=>{
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action)=>{
            state.selectedUser = action.payload;
        },
    },
});

export const { setAuthUser, setSuggestedUser, setUserProfile, setSelectedUser } = authSlice.actions;
export default authSlice.reducer;