import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Helper to get token from sessionStorage first, then fallback to localStorage
const getStoredToken = () => {
  // Check sessionStorage first (tab-specific)
  const sessionToken = sessionStorage.getItem("token");
  if (sessionToken) return sessionToken;

  // Fallback to localStorage (shared across tabs) - for normal users
  const localToken = localStorage.getItem("token");
  if (localToken) {
    // Migrate to sessionStorage for this tab
    sessionStorage.setItem("token", localToken);
    return localToken;
  }

  return null;
};

// Helper to store token in appropriate storage
const storeToken = (token, isolateTab = false) => {
  if (isolateTab) {
    // Store only in sessionStorage (tab-specific, won't affect other tabs)
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("tabIsolated", "true");
  } else {
    // Store in both (normal behavior - tabs stay in sync)
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token);
  }
};

// Helper to remove token from storage
const removeToken = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("tabIsolated");
  sessionStorage.removeItem("currentRole");

  // Only remove from localStorage if this was the last tab
  // (Check if there are other tabs with sessions)
  const isIsolated = sessionStorage.getItem("tabIsolated") === "true";
  if (!isIsolated) {
    localStorage.removeItem("token");
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(getStoredToken());
  const [tabId] = useState(
    () => `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Store current tab's role in sessionStorage (tab-specific)
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("currentRole", user.role);
    }
  }, [user]);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // DON'T listen for storage changes - let each tab maintain its own session
  // This allows admin and user to coexist in different tabs

  // Fetch current user
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { user, token } = response.data.data;

      // Check if there's already a different role logged in another tab
      const existingLocalToken = localStorage.getItem("token");
      const shouldIsolate = existingLocalToken && existingLocalToken !== token;

      // Store token with appropriate isolation
      storeToken(token, shouldIsolate);
      sessionStorage.setItem("currentRole", user.role);

      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (shouldIsolate) {
        // console.log(
        //   `[Tab ${tabId}] Isolated login as ${user.role}: ${user.email} (another session exists)`
        // );
      } else {
        // console.log(`[Tab ${tabId}] Logged in as ${user.role}: ${user.email}`);
      }

      return { success: true, user }; // Return user object
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // Don't auto-login, just return success
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    console.log(`[Tab ${tabId}] Logging out ${user?.role || "user"}`);

    // Remove tokens using helper
    removeToken();

    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
