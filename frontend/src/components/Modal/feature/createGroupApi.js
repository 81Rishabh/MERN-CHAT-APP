import { createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../../helper/url";
import axios from "axios";

export const getGroups = createAsyncThunk("chat/groups", async (thunkAPI) => {
  try {
    let res = await axios(URL.getAllGroups);
    return res.data.data;
  } catch (error) {
    console.log(error);
    thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createGroup = createAsyncThunk(
  "chat/createGroup",
  async (data, thunkAPI) => { 
    // options
    const options = {
      url: URL.create_group,
      method: "POST",
      contentType: "application/json",
      data: data
    };
    
    try {
      const res = await axios(options);
      return res.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
