import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../services/authService";
import { tryRefreshToken } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { LoginPayload } from "../types/auth";

interface AuthContextValue {
  user: ReturnType<typeof useAuthStore.getState>["user"];
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  sessionMessage: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: (message?: string) => void;
  refresh: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, sessionMessage, setSession, clearSession } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const refreshed = await tryRefreshToken();
      if (!refreshed) {
        clearSession();
      }
      setIsBootstrapping(false);
    };
    void bootstrap();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      sessionMessage,
      login: async (payload) => {
        const response = await loginRequest(payload);
        setSession({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        });
        navigate(response.user.role === "Faculty" ? "/faculty" : "/student", { replace: true });
      },
      logout: (message) => {
        clearSession(message);
        navigate("/login", { replace: true });
      },
      refresh: () => tryRefreshToken(),
    }),
    [user, isBootstrapping, sessionMessage, setSession, clearSession, navigate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
