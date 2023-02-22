import { createAsyncThunk } from "@reduxjs/toolkit";
import usersServices from "./usersServices";
import axios from "axios";
import { getCredentials } from "../../../../utils/getCredential";
import { URL } from "../../../../helper/url";

export const fetchMessage = createAsyncThunk(
  'user/fetchMessages',
  async (senderID, {rejectWithValue}) => {
     const {token} = getCredentials();

     try {
       let options = {
          method: 'GET',
          url : URL.fetchMessages(senderID),
          headers : {
            Authorization: `Bearer ${token}`
          }
       };

       let res = await axios(options);
       return {
          data : res.data.data,
          userId : senderID
       }
     } catch (error) {
        return rejectWithValue(error.response.data);
     }
  }
)


export const getAllUsers = createAsyncThunk("Users/getAllUsers", async (thunkAPI) => {
  try {
    return await usersServices.getUsers();
  } catch (err) {
    console.log(err);
  }
});
