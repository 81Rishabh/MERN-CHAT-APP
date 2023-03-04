import { createSlice } from "@reduxjs/toolkit";
import { getGroupByUserId, saveGroupInDB } from "./groupApi";

let initialState = {
  loading: false,
  isNewGroupCreated: false,
  isCreated: true,
  groups: [],
  myGroups: [],
  currentGroupDetils: null,
  error: null,
  isNetworkError: false,
  isUpdated: false,
};

const groupSlice = createSlice({
  name: "chat/groups",
  initialState,
  reducers: {
    resetGroupState: (state) => {
      state.currentGroupDetils = null;
      state.error = null;
    },
    getGroupById: (state, action) => {
      const { groupId } = action.payload;
      state.currentGroupDetils =  state.myGroups.find((group) => group._id === groupId);
    },
    saveGroupInMemory: (state, action) => {
      state.groups.push(action.payload);
    },
    saveGroupMessage: (state, action) => {
      const groups = state.myGroups;
      groups.forEach((group) => {
        if (group._id === action.payload.groupId) {
          // group.mess
          group.messages.push(action.payload);
        }
      });
      state.isUpdated = true;
    },
    isNewGroupCreated: (state) => {
      state.isNewGroupCreated = true;
    },
    resetSomeState: (state) => {
      state.isNewGroupCreated = false;
      state.isCreated = false;
    },
  },
  extraReducers: (builder) => {
    // fetch groups
    // builder
    //   .addCase(getGroups.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(getGroups.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.groups = action.payload;
    //     state.isNetworkError = false;
    //   })
    //   .addCase(getGroups.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //     state.isNetworkError = true;
    //   });

    // fetch group for individal user

    builder
      .addCase(getGroupByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.myGroups = action.payload;
        state.isNetworkError = false;
      })
      .addCase(getGroupByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isNetworkError = true;
      });

    // create group
    builder
      .addCase(saveGroupInDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveGroupInDB.fulfilled, (state) => {
        state.loading = false;
        state.isNewGroupCreated = true;
        state.isCreated = true;
        state.error = null;
        state.isNetworkError = false;
      })
      .addCase(saveGroupInDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isNewGroupCreated = false;
        state.isCreated = false;
        state.isNetworkError = true;
      });
  },
});

export default groupSlice.reducer;
export const {
  getGroupById,
  resetGroupState,
  saveGroupMessage,
  isNewGroupCreated,
  saveGroupInMemory,
  resetSomeState,
} = groupSlice.actions;
