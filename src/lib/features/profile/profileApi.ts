import { baseApi } from "../api/api";
import type { UserProfile } from "../types/task-type";

export type UpdateProfilePayload = {
  fullName?:     string;
  username?:     string;
  email?:        string;
  profilePhoto?: string;
  gender?:       "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getProfile: builder.query<UserProfile, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({ url: "/profile", method: "PUT", body }),
      invalidatesTags: ["Profile"],
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/profile/password", method: "PATCH", body }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;