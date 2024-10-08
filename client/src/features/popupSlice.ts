import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isPopupVisible: boolean;
  messages: string[];
} = {
  isPopupVisible: false,
  messages: [],
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    showPopup: (state, action) => {
      state.isPopupVisible = true;
      state.messages.push(...action.payload.messages);
    },
    hidePopup: (state, action) => {
      if (state.messages.length > 0) {
        state.messages.splice(action.payload.index, 1);
      }
      if (state.messages.length === 0) {
        state.isPopupVisible = false;
      }
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;

export default popupSlice.reducer;
