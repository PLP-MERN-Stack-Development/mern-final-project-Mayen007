import { createContext, useContext, useState } from "react";
import LoadingModal from "../components/LoadingModal";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({
    isLoading: false,
    message: "Loading...",
    type: "default", // 'default', 'upload', 'delete', 'submit'
    progress: null, // For upload progress (0-100)
  });

  const showLoading = (
    message = "Loading...",
    type = "default",
    progress = null
  ) => {
    setLoading({ isLoading: true, message, type, progress });
  };

  const hideLoading = () => {
    setLoading({
      isLoading: false,
      message: "",
      type: "default",
      progress: null,
    });
  };

  const updateProgress = (progress) => {
    setLoading((prev) => ({ ...prev, progress }));
  };

  const updateMessage = (message) => {
    setLoading((prev) => ({ ...prev, message }));
  };

  return (
    <LoadingContext.Provider
      value={{
        loading,
        showLoading,
        hideLoading,
        updateProgress,
        updateMessage,
      }}
    >
      {children}
      <LoadingModal
        isOpen={loading.isLoading}
        message={loading.message}
        type={loading.type}
        progress={loading.progress}
      />
    </LoadingContext.Provider>
  );
};
