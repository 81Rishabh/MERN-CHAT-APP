import { createSlice } from "@reduxjs/toolkit";
import { sendGroupMessage } from "./groupMessageApi";

let initialState = {
  loading: false,
  isSuccess : false,
  error: null,
};

const grouMessageSlice = createSlice({
  name: "chat/group_message",
  initialState,
  extraReducers: (builder) => {
    // send group mesage
    builder
      .addCase(sendGroupMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendGroupMessage.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(sendGroupMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isSuccess = false;
      });
  },
});

export default grouMessageSlice.reducer;
