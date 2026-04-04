import { baseApi } from "../api/api";
import type { Notification, PageResponse } from "../types/task-type";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PageResponse<Notification>, { page?: number; size?: number }>({
      query: (params) => ({ url: "/notifications", params: { page: 0, size: 20, ...params } }),
      providesTags: ["Notification"],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification"],
    }),
    // Both endpoints return 204 No Content — baseApi.responseHandler now returns
    // null instead of undefined so RTK Query no longer rejects these responses.
    markAllRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    markRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} = notificationsApi;