import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User { id: string; name: string; email: string; avatar?: string; }

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const COOKIE_OPTIONS = "path=/; SameSite=Lax; max-age=86400";

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${COOKIE_OPTIONS}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

function load(): Pick<AuthState, "user" | "token" | "refreshToken" | "isAuthenticated"> {
  if (typeof window === "undefined")
    return { user: null, token: null, refreshToken: null, isAuthenticated: false };
  try {
    const token        = getCookie("token");
    const refreshToken = getCookie("refreshToken");
    const userStr      = getCookie("user");
    const user: User | null = userStr ? JSON.parse(userStr) : null;
    return { token, refreshToken, user, isAuthenticated: !!token };
  } catch {
    return { user: null, token: null, refreshToken: null, isAuthenticated: false };
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: { ...load(), isLoading: false } as AuthState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) {
      state.user            = action.payload.user;
      state.token           = action.payload.token;
      state.refreshToken    = action.payload.refreshToken ?? null;
      state.isAuthenticated = true;
      setCookie("token", action.payload.token);
      setCookie("user", JSON.stringify(action.payload.user));
      if (action.payload.refreshToken) setCookie("refreshToken", action.payload.refreshToken);
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setCookie("user", JSON.stringify(state.user));
      }
    },
    logout(state) {
      state.user = null; state.token = null; state.refreshToken = null; state.isAuthenticated = false;
      deleteCookie("token"); deleteCookie("refreshToken"); deleteCookie("user");
    },
    setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload; },
  },
});

export const { setCredentials, updateUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;