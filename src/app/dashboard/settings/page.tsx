"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCredentials, updateUser } from "@/lib/features/auth/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/lib/features/profile/profileApi";
import { Upload, Eye, EyeOff } from "lucide-react";
import { updateProfileSchema, changePasswordSchema } from "@/lib/schemas";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const { data: profile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState<any>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (profile) setForm({ ...form, ...profile });
  }, [profile]);

  const handleSave = async () => {
    const result = updateProfileSchema.safeParse(form);
    if (!result.success) return;

    const updated = await updateProfile(result.data).unwrap();

    if (user && token) {
      dispatch(
          setCredentials({
            user: { ...user, name: updated.fullName, email: updated.email },
            token,
          })
      );
    }

    dispatch(updateUser({ name: updated.fullName, email: updated.email }));
  };

  const handlePasswordSave = async () => {
    const result = changePasswordSchema.safeParse(pwdForm);
    if (!result.success) return;

    await changePassword({
      currentPassword: result.data.currentPassword,
      newPassword: result.data.newPassword,
    });

    setShowPassword(false);
    setPwdForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const initials =
      form.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "JD";

  return (
      <div className="flex-1 bg-[#f8fafc] min-h-screen">
        <div className="max-w-5xl mx-auto px-10 py-10">

          {/* TITLE */}
          <h1 className="text-[24px] font-semibold mb-6 text-[#111827]">
            Settings
          </h1>

          {/* TABS */}
          <div className="flex gap-8 border-b mb-7 text-[14px]">
            {["Profile", "Notification", "Integration", "Subscription"].map(
                (t, i) => (
                    <button
                        key={t}
                        className={`pb-4 ${
                            i === 0
                                ? "text-[#4f46e5] border-b-2 border-[#4f46e5]"
                                : "text-gray-400"
                        }`}
                    >
                      {t}
                    </button>
                )
            )}
          </div>

          {/* PROFILE */}
          <h2 className="text-[22px] font-bold mb-5 text-[#111827]">
            Profile
          </h2>

          {/* AVATAR */}
          <div className="flex items-center gap-5 mb-7">
            <div className="w-14 h-14 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-base font-semibold">
              {initials}
            </div>

            <button className="flex items-center gap-2 px-4 h-10 text-[14px] bg-[#4f46e5] text-white rounded-md">
              <Upload size={16} />
              Update Picture
            </button>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">

            <div>
              <label className="text-[13px] mb-2 block text-[#374151]">
                Full Name
              </label>
              <input
                  value={form.fullName}
                  onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full h-11 px-4 border rounded-md text-[14px]"
              />
            </div>

            <div>
              <label className="text-[13px] mb-2 block text-[#374151]">
                Email Address
              </label>
              <input
                  value={form.email}
                  onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                  }
                  className="w-full h-11 px-4 border rounded-md text-[14px]"
              />
            </div>
          </div>

          <button
              onClick={handleSave}
              className="mt-6 px-6 h-10 bg-[#4f46e5] text-white text-[14px] rounded-md"
          >
            Save Changes
          </button>

          {/* DIVIDER */}
          <hr className="my-10 border-[#e5e7eb]" />

          {/* PASSWORD */}
          <h2 className="text-[16px] font-semibold mb-4">Password</h2>

          <button
              onClick={() => setShowPassword(!showPassword)}
              className="px-5 h-10 text-[14px] border rounded-md hover:bg-gray-50"
          >
            Change My Password
          </button>

          {showPassword && (
              <div className="mt-6 space-y-5 max-w-md">

                {[
                  { key: "currentPassword", label: "Current Password" },
                  { key: "newPassword", label: "New Password" },
                  { key: "confirmPassword", label: "Confirm Password" },
                ].map(({ key, label }) => (
                    <div key={key} className="relative space-y-2">
                      <label className="text-[13px]">{label}</label>

                      <input
                          type={show[key] ? "text" : "password"}
                          value={(pwdForm as any)[key]}
                          onChange={(e) =>
                              setPwdForm({ ...pwdForm, [key]: e.target.value })
                          }
                          className="w-full h-11 px-4 pr-10 border rounded-md text-[14px]"
                      />

                      <button
                          onClick={() =>
                              setShow({ ...show, [key]: !show[key] })
                          }
                          className="absolute right-3 top-[38px] text-gray-400"
                      >
                        {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                ))}

                <button
                    onClick={handlePasswordSave}
                    className="px-6 h-10 bg-[#4f46e5] text-white text-[14px] rounded-md"
                >
                  Update Password
                </button>
              </div>
          )}
        </div>
      </div>
  );
}