import { createSlice } from "@reduxjs/toolkit";
import { createMessage } from "./messageApi";

const initialState = {
  loading: false,
  isCreated: false,
  isError: false,
};

const messageSlice = createSlice({
  name: "user/crate_message",
  initialState,
  extraReducers: (builder) => {
       builder
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMessage.fulfilled, (state) => {
        state.loading = false;
        state.isCreated = true;
      })
      .addCase(createMessage.rejected, (state) => {
        state.loading = false;
        state.isCreated = false;
      });

     
  },
});

export default messageSlice.reducer;
