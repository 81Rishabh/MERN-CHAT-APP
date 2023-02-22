import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "../../../../helper/url";
import { showNotification } from "../../../../helper/notification";
import { getCredentials } from "../../../../utils/getCredential";

export const login = createAsyncThunk(
  "auth/login",
  async function (credentials , {rejectWithValue}) {
    const { email, password } = credentials;
    try {
      let response = await axios({
        method: "POST",
        url: URL.sign_in,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          email,
          password,
        }),
      });
      return response.data.data;
    } catch (error) {
      let { message } = error.response.data;
      showNotification("error", message);
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/sign_up",
  async function (credentials, thunkAPI) {
    const { username, email, password, conform_password } = credentials;
    try {
      let response = await axios({
        method: "POST",
        url: URL.sign_up,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          username,
          email,
          password,
          conform_password,
        }),
      });
      // show notification
      showNotification("success", response.data.message);
      return response.data;
    } catch (error) {
      let { message } = error.response.data;
      showNotification("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// sign out
export const sign_out = createAsyncThunk("auth/sign_out", function () {
  localStorage.removeItem("token");
});

// profile upload
export const profile_upload = createAsyncThunk(
  "auth/profile_upload",
  async function (formData) {
    const { user_id, token } = getCredentials();
    try {
      let res = await axios({
        method: "POST",
        url: URL.profile_upload(user_id),
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });
      return res.data.img_url;
    } catch (error) {
      // let {message} = error.response.data.error;
      console.log(error.response);
      // showNotification('error' , message)
    }
  }
);

// get profile defails
export const getProfile = createAsyncThunk("auth/profile", async (_,thunkAPI) => {
  const { user_id, token } = getCredentials();
  try {
    const options = {
      method: "get",
      url: URL.profile(user_id),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios(options);
    return res.data.data;
  } catch (error) {
    const message =
    (error.response &&
      error.response.data &&
      error.response.data.message) ||
    error.message ||
    error.toString()
    return thunkAPI.rejectWithValue(message);
  }
});
