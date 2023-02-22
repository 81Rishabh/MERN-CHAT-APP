import { createSlice } from "@reduxjs/toolkit";
import { getProfile, login, profile_upload, signUp } from "./api/authApi";

// intial authentication state
const initialState = {
  user : {},
  loading: false,
  isRegistered: false,
  isLoggedIn: false,
  isUploaded:false,
  error: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers : {
     reset : (state) => {
        state.user = {};
        state.loading = false;
        state.isRegistered = false;
        state.isUploaded = false;
        state.error = null;
     },
   
  },
  extraReducers: (builder) => {
    // #################### SIGNIN #####################
    // login PENDING
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });

    // login FULLFILED
    builder.addCase(login.fulfilled, (state ,action) => {
      localStorage.setItem('token' , action.payload.token);
      localStorage.setItem('userId' , action.payload.user._id);  
      state.user = action.payload.user;
      state.loading = false;
      state.isLoggedIn = true;
      state.error = "";
    });

    // login REJECT
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.error = action.payload;
    });


    // SIGNUP PENDING
     builder
     .addCase(signUp.pending, (state) => {
       state.loading = true;
     })
     .addCase(signUp.fulfilled, (state) => {
      state.loading = false;
      state.isRegistered = true;
      state.error = "";
    })
    .addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.isRegistered = false;
      state.error = action.payload;
    });

    // GET PROFILE
    builder
    .addCase(getProfile.pending, (state) => {
      state.loading = true;
    })
    .addCase(getProfile.fulfilled, (state,action) => {
     state.loading = false;
     state.user = action.payload;
     state.error = null;
   })
   .addCase(getProfile.rejected, (state,action) => {
     state.loading = false;
     state.user = {};
     state.error = action.payload;
   });

  // profile upload
    builder
    .addCase(profile_upload.pending , (state) => {
        state.loading = true;
    })
    .addCase(profile_upload.fulfilled, (state,action) => {
        state.loading = false;
        state.isUploaded = true;
        state.user.profile_img = action.payload;
    })
    .addCase(profile_upload.rejected , (state) => {
       state.loading = false;
       state.isUploaded = false;
    })
  },
});

export default authReducer.reducer;
export const { reset } = authReducer.actions;
