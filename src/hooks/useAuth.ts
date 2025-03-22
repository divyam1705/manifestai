import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import {
  getCurrentUser,
  login,
  logout,
  signUp,
  LoginCredentials,
  SignupCredentials,
} from "@/api/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { isAuthenticated, userId, email, setAuthenticated } = useUserStore();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { user, error } = await getCurrentUser();
        if (error) throw error;

        if (user) {
          setAuthenticated(true, user.id, user.email);
        } else {
          setAuthenticated(false, null, null);
        }
      } catch (err) {
        setError(err as Error);
        setAuthenticated(false, null, null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuthenticated]);

  // Login function
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await login(credentials);
      if (error) throw error;

      if (data && data.user) {
        setAuthenticated(true, data.user.id, data.user.email);
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      setError(err as Error);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const handleSignup = async (credentials: SignupCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp(credentials);
      if (error) throw error;

      if (data && data.user) {
        setAuthenticated(true, data.user.id, data.user.email);
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      setError(err as Error);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await logout();
      if (error) throw error;

      setAuthenticated(false, null, null);
      return { success: true };
    } catch (err) {
      setError(err as Error);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    userId,
    email,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};
