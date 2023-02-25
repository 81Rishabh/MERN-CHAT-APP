import { createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../helper/url";
import { Axios as axios } from "../../config/axiosConfig";
import { showNotification } from "../../helper/notification";
import { getCredentials } from "../../utils/getCredential";

export const getGroupByUserId = createAsyncThunk("chat/fetchGroupByUserId", async (_,thunkAPI) => {
  const {token} = getCredentials();
  try {
    let res = await axios(URL.getGroupByUserID , {
      headers : {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data.data;
  } catch (error) {
    if(error.message === "Network Error") {
      showNotification('error' , error.message);
      return thunkAPI.rejectWithValue(error.message);
    } else {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
});

export const getGroups = createAsyncThunk("chat/groups", async (_,thunkAPI) => {
  try {
    let res = await axios(URL.getAllGroups);
    return res.data.data;
  } catch (error) {
    if(error.message === "Network Error") {
      showNotification('error' , error.message);
      return thunkAPI.rejectWithValue(error.message);
    } else {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
});

export const saveGroupInDB = createAsyncThunk(
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
      if(error.message === "Network Error") {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  }
);
