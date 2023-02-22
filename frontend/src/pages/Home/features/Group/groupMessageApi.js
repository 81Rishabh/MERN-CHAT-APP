import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "../../../../helper/url";

export const sendGroupMessage = createAsyncThunk(
  "chat/send_group_message",
  async (data, thunkAPI) => { 
    // options
    const options = {
      url: URL.send_group_message,
      method: "POST",
      contentType: "application/json",
      data: data
    };
    
    try {
      const res = await axios(options);
      console.log(res.data.data);
      return res.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
