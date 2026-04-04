import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith("token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  // FIX: baseUrl must point to the Next.js proxy routes (/api/...),
  // NOT directly to the external API (taskflow-api-682258391368...).
  // Direct calls to the external API are blocked by CORS in the browser.
  // All requests go through /api/* which server-side proxies to the backend.
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token ?? getTokenFromCookie();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      // FIX: return null (not undefined) for empty 204 No Content responses.
      // RTK Query requires { data: <value> } — undefined is rejected, null is valid.
      if (!text) return null;
      try {
        const json = JSON.parse(text);
        return json?.data !== undefined ? json.data : json;
      } catch {
        return text;
      }
    },
  }),
  tagTypes: [
    "Task", "PersonalTask", "ProjectTask",
    "Project", "Team", "TeamMember",
    "Stats", "Activity",
    "Notification",
    "Profile",
    "Comment", "Attachment",
  ],
  endpoints: () => ({}),
});