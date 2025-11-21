import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const AdminNotifications = () => {
  const {
    notifications,
    markAsRead,
    markAllRead,
    remove,
    clearAll,
    unreadCount,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleOutside(e) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          const newOpen = !open;
          setOpen(newOpen);
          if (newOpen) markAllRead();
        }}
        className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        title="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="admin-notifications-panel"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id="admin-notifications-panel"
          role="region"
          aria-label="Admin notifications"
          className="absolute right-0 mt-2 w-96 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-900">
              Notifications
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => clearAll()}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No notifications</div>
            )}
            <ul role="list">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  role="listitem"
                  className={`p-3 border-b ${
                    n.read ? "bg-white" : "bg-gray-50"
                  } border-gray-100`}
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => {
                        const reportId = n.meta?.reportId;
                        try {
                          if (reportId) {
                            navigate(`/reports/${reportId}`);
                          }
                        } catch (err) {
                          console.warn("Navigation failed", err);
                        }
                        markAsRead(n.id);
                        setOpen(false);
                      }}
                      className="text-left flex-1"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {n.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {n.message}
                      </div>
                      <div className="text-xxs text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </button>
                    <div className="flex flex-col items-end gap-2 ml-3">
                      <button
                        onClick={() => remove(n.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Dismiss
                      </button>
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
