import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const LoadingModal = ({ isOpen, message, type, progress }) => {
  // Icon and color based on type
  const getTypeStyles = () => {
    switch (type) {
      case "upload":
        return {
          icon: CloudArrowUpIcon,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "delete":
        return {
          icon: TrashIcon,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "submit":
        return {
          icon: CheckCircleIcon,
          color: "text-primary-600",
          bgColor: "bg-primary-50",
          borderColor: "border-primary-200",
        };
      default:
        return {
          icon: ArrowPathIcon,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const { icon: Icon, color, bgColor, borderColor } = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 ${borderColor}`}
              role="dialog"
              aria-modal="true"
              aria-label={message || "Loading"}
            >
              {/* Icon Container */}
              <div
                className={`${bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <motion.div
                  animate={{
                    rotate: type === "default" || type === "upload" ? 360 : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Icon className={`w-10 h-10 ${color}`} />
                </motion.div>
              </div>

              {/* Message */}
              <p
                className="text-center text-lg font-semibold text-gray-900 mb-4"
                aria-live="polite"
              >
                {message}
              </p>

              {/* Progress Bar (for upload type) */}
              {progress !== null && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${
                        type === "upload" ? "bg-blue-600" : "bg-primary-600"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Animated dots for default loading */}
              {progress === null && (
                <div className="flex justify-center gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className={`w-2 h-2 rounded-full ${
                        type === "upload"
                          ? "bg-blue-600"
                          : type === "delete"
                          ? "bg-red-600"
                          : type === "submit"
                          ? "bg-primary-600"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;
