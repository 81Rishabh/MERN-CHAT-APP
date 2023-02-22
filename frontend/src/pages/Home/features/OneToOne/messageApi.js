import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "../../../../helper/url";



export const createMessage = createAsyncThunk(
  "user/create_message",
  async (MessageData, { rejectWithValue }) => {

    try {
      let options = {
        method: "POST",
        url: URL.send_message,
        contentType: "application/json",
        data: MessageData,
      };
      let res = await axios(options);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


