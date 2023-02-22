import { createSlice } from "@reduxjs/toolkit";
import { getGroups, createGroup } from "./createGroupApi";

let initialState = {
  loading: false,
  isCreated: true,
  groups: [],
  currentGroupDetils: null,
  error: null,
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
      const { groups, groupId } = action.payload;
      state.currentGroupDetils = groups.find((group) => group._id === groupId);
    },
    saveGroupMessage: (state, action) => {
      const groups = state.groups;
      groups.forEach((group) => {
        if (group._id === action.payload.groupId) {
          // group.mess
          group.messages.push(action.payload);
        }
      });
      state.isUpdated = true;
    },
  },
  extraReducers: (builder) => {
    // fetch groups
    builder
      .addCase(getGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // create group
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.isCreated = false;
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.loading = false;
        state.isCreated = true;
        state.error = null;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCreated = false;
      });
  },
});

export default groupSlice.reducer;
export const { getGroupById, resetGroupState, saveGroupMessage } =
  groupSlice.actions;
