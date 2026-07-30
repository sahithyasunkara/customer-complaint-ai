import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  activeToast: null,
  pasteDialogOpen: false,
  backendStatus: "checking",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    showToast(state, action) {
      state.activeToast = action.payload;
    },
    clearToast(state) {
      state.activeToast = null;
    },
    setPasteDialogOpen(state, action) {
      state.pasteDialogOpen = action.payload;
    },
    setBackendStatus(state, action) {
      state.backendStatus = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  showToast,
  clearToast,
  setPasteDialogOpen,
  setBackendStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
