// Redux Toolkit store configuration
// Redux is a state management library - it helps manage global app state

import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "./api/tasksApi";

export const store = configureStore({
  reducer: {
    // Add RTK Query API reducer
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  
  // Add RTK Query middleware for caching and invalidation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
});

// Export types for TypeScript
// These help TypeScript understand your store structure
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

