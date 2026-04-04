import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./features/api/api";
import authReducer from "./features/auth/authSlice";
import kanbanReducer from "./features/kanban/kanbanSlice";

// Register all endpoint modules (side-effect: injects endpoints into baseApi)
import "./features/auth/authApi";
import "./features/profile/profileApi";
import "./features/tasks/taskApi";
import "./features/team/teamApi";
import "./features/notifications/notificationsApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    kanban: kanbanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
