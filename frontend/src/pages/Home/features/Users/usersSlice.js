import { createSlice } from "@reduxjs/toolkit";
import { fetchMessageByUser as fetchMessage, getAllUsers } from "./usersApi";

// initilState
const initialState = {
  data: [],
  usersFetched : false,
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
      let currentUser = getCurrentUser(data, userId);
      state.user = currentUser;
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
    saveSentLastMessage : (state, action) => {
       let user = state.data.find(user => user._id === action.payload.to);
       user.lastMessage = action.payload;
    },
    saveReceivedLastMessage : (state, action) => {
      let user = state.data.find(user => user._id === action.payload.from);
      user.lastMessage = {
        ...action.payload,
        isSelected : state.user._id === user._id ? true : false,
      }
    },
    newMessageViewed : (state ,action) => {
      if(state.data.length > 0) {
        let user = state.data.find(user => user._id === action.payload);
        if(user.lastMessage !== null && user.lastMessage.hasOwnProperty('isSelected')) {
          user.lastMessage['isSelected'] = true; 
        }
      }
    },
    setUserStatus : (state,action) => {
       if(state.data.length > 0) {
          let user = state.data.find(user => user._id === action.payload.id);
          user['isOnline'] = action.payload.online; 
       }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.usersFetched = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const { users } = action.payload;
        const loggedInUser = localStorage.getItem("userId");
        const user = users.filter((user) => user._id !== loggedInUser);
        state.usersFetched = false;
        state.data = [...user];
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.usersFetched = false;
        state.data = [];
      });

    builder
      .addCase(fetchMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessage.fulfilled, (state, action) => {
        let user;
        const {userId,data} = action.payload;
        user = state.data.find((user) => user._id === userId);
        // save message
        user.message = [...data];
        // last message
        user.lastMessage = data.length > 0 ? data.at(-1) : null;
        state.loading = false;
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
  saveSentLastMessage,
  saveReceivedLastMessage,
  newMessageViewed,
  setUserStatus
} = usersSlice.actions;
