import { configureStore } from "@reduxjs/toolkit";

import aiReducer from "./slices/aiSlice";
import authReducer from "./slices/authSlice";
import complaintReducer from "./slices/complaintSlice";
import dashboardReducer from "./slices/dashboardSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaint: complaintReducer,
    dashboard: dashboardReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
