import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import SessionTimeoutModal from "../components/SessionTimeoutModal";

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  // Configurable timeout durations (in milliseconds)
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIMEOUT = 28 * 60 * 1000; // 28 minutes (2 minutes before lockout)
  const WARNING_DURATION = 2 * 60; // 2 minutes in seconds

  const resetTimer = () => {
    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning if showing
    setShowWarning(false);

    // Only set timers if user is logged in
    if (user) {
      // Set warning timeout
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(true);
      }, WARNING_TIMEOUT);

      // Set logout timeout
      timeoutRef.current = setTimeout(() => {
        handleInactivityLogout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  const handleInactivityLogout = () => {
    // Clear timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    setShowWarning(false);
    logout();
  };

  useEffect(() => {
    if (!user) {
      // Clear timeouts if user logs out manually
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      setShowWarning(false);
      return;
    }

    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timer on any activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [user]);

  const value = {
    resetTimer,
    lastActivity: lastActivityRef.current,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
      <SessionTimeoutModal
        isOpen={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleInactivityLogout}
        remainingTime={WARNING_DURATION}
      />
    </ActivityContext.Provider>
  );
};
