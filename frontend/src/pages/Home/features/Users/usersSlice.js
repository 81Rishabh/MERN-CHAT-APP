import { createSlice } from "@reduxjs/toolkit";
import { fetchMessage, getAllUsers } from "./usersApi";

// initilState
const initialState = {
  data: [],
  loading: false,
  user: null,
  isSelected: false,
};

const usersSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {
    resetUsersState: (state) => {
      state.user = null;
      state.isSelected = false;
    },
    currentUser: (state, action) => {
      const { data, userId } = action.payload;
      state.user = getCurrentUser(data, userId);
      state.isSelected = true;
    },
    saveSendMessage: (state, action) => {
      const ID = action.payload.to;
      saveMessage(state.data, ID, action);
    },
    saveReceivedMessage: (state, action) => {
      const ID = action.payload.from;
      saveMessage(state.data, ID, action);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const { users } = action.payload;
        const loggedInUser = localStorage.getItem("userId");
        const user = users.filter((user) => user._id !== loggedInUser);
        state.loading = false;
        state.data = [...user];
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.loading = false;
        state.data = [];
      });

    builder
      .addCase(fetchMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessage.fulfilled, (state, action) => {
        state.loading = false;
        let user = state.data.find(
          (user) => user._id === action.payload.userId
        );
        user.message = [...action.payload.data];
      })
      .addCase(fetchMessage.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
      });
  },
});

const saveMessage = function (users, userId, action) {
  users.forEach((user) => {
    if (user._id === userId) {
      user.message.push(action.payload);
    }
  });
};

const getCurrentUser = function (data, id) {
  if (data.length > 0) {
    return data.find((user) => user._id === id);
  }
};

export default usersSlice.reducer;
export const {
  currentUser,
  resetUsersState,
  saveSendMessage,
  saveReceivedMessage,
} = usersSlice.actions;
