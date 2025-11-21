import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useNotifications } from "../context/NotificationContext";

const Admin = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, reports
  const [reportFilter, setReportFilter] = useState("all"); // all, pending, verified, in-progress, resolved
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const socket = useSocket();
  const { addNotification } = useNotifications();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        showLoading("Loading admin statistics...");
        const { data } = await axios.get("/api/admin/stats");
        setStats(data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load stats");
      } finally {
        hideLoading();
      }
    };

    if (user?.role === "admin") {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch users when users tab is active
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        showLoading("Loading users...");
        const { data } = await axios.get("/api/admin/users");
        setUsers(data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load users");
      } finally {
        hideLoading();
      }
    };

    if (activeTab === "users" && user?.role === "admin") {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // Fetch reports when reports tab is active
  useEffect(() => {
    const fetchReports = async () => {
      try {
        showLoading("Loading reports...");
        const statusParam =
          reportFilter !== "all" ? `status=${reportFilter}&` : "";
        const { data } = await axios.get(
          `/api/admin/reports?${statusParam}limit=1000`
        );
        setReports(data.data.reports);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load reports");
      } finally {
        hideLoading();
      }
    };

    if (activeTab === "reports" && user?.role === "admin") {
      fetchReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user, reportFilter]);

  // Listen for new reports via socket (admins only)
  useEffect(() => {
    if (!socket || !user || user.role !== "admin") return;

    const onNewReport = (newReport) => {
      try {
        // Prepend to reports list so admin sees it immediately
        setReports((prev) => (prev ? [newReport, ...prev] : [newReport]));

        // Update stats total if present
        setStats((prev) =>
          prev
            ? {
                ...prev,
                totalReports: (prev.totalReports || prev.total || 0) + 1,
              }
            : prev
        );

        // Persist and show admin notification (also shows toast via NotificationContext)
        try {
          addNotification({
            id: newReport._id,
            title: `New report: ${newReport.title}`,
            message: newReport.description || "",
            createdAt: newReport.createdAt || new Date().toISOString(),
            meta: { reportId: newReport._id },
          });
        } catch (e) {
          console.warn("Failed to add admin notification", e);
        }
      } catch (err) {
        console.warn("Error handling new report socket event:", err);
      }
    };

    socket.on("report:created", onNewReport);

    return () => {
      socket.off("report:created", onNewReport);
    };
  }, [socket, user]);

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      showLoading("Updating user role...");
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setSuccessMessage("User role updated successfully");
      // Refresh users list
      const { data } = await axios.get("/api/admin/users");
      setUsers(data.data);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user role");
      setTimeout(() => setError(""), 3000);
    } finally {
      hideLoading();
    }
  };

  const handleBulkReportAction = async (action, reportIds) => {
    try {
      showLoading("Updating reports...");
      await axios.patch("/api/admin/reports/bulk", {
        reportIds,
        status: action,
      });
      setSuccessMessage(`Reports ${action} successfully`);
      // Refresh stats
      const { data } = await axios.get("/api/admin/stats");
      setStats(data.data);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update reports");
      setTimeout(() => setError(""), 3000);
    } finally {
      hideLoading();
    }
  };

  const handleOpenNotesModal = (report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || "");
    setShowNotesModal(true);
  };

  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setSelectedReport(null);
    setAdminNotes("");
  };

  const handleSaveAdminNotes = async () => {
    if (!selectedReport) return;

    try {
      showLoading("Saving admin notes...");
      await axios.patch(`/api/admin/reports/${selectedReport._id}/notes`, {
        adminNotes,
      });
      setSuccessMessage("Admin notes saved successfully");

      // Update the report in the local state
      setReports(
        reports.map((r) =>
          r._id === selectedReport._id ? { ...r, adminNotes } : r
        )
      );

      handleCloseNotesModal();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save admin notes");
      setTimeout(() => setError(""), 3000);
    } finally {
      hideLoading();
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with Admin Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Admin Control Panel
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                  System management and user administration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-purple-300">
                  Administrator Access
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-900/50 border border-green-500/50 text-green-200 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {successMessage}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex gap-2 sm:gap-4 border-b border-gray-700 overflow-x-auto bg-gray-800/50 rounded-t-lg px-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 pt-4 px-3 sm:px-4 font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
              activeTab === "overview"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 pt-4 px-3 sm:px-4 font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
              activeTab === "users"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Users
            </div>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-4 pt-4 px-3 sm:px-4 font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
              activeTab === "reports"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Reports
            </div>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 border border-blue-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-100 font-semibold text-sm">
                  Total Users
                </h3>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-blue-200 mt-2">Registered accounts</p>
            </motion.div>

            {/* Total Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 border border-emerald-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-emerald-100 font-semibold text-sm">
                  Total Reports
                </h3>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.totalReports}
              </p>
              <p className="text-sm text-emerald-200 mt-2">All submissions</p>
            </motion.div>

            {/* Pending Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 border border-amber-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-amber-100 font-semibold text-sm">
                  Pending
                </h3>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.reportsByStatus.pending}
              </p>
              <p className="text-sm text-amber-200 mt-2">Awaiting review</p>
            </motion.div>

            {/* Resolved Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-100 font-semibold text-sm">
                  Resolved
                </h3>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.reportsByStatus.resolved}
              </p>
              <p className="text-sm text-purple-200 mt-2">
                Successfully handled
              </p>
            </motion.div>

            {/* Reports by Severity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 md:col-span-2"
            >
              <h3 className="text-gray-200 font-semibold mb-4">
                Reports by Severity
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.reportsBySeverity).map(
                  ([severity, count]) => (
                    <div
                      key={severity}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            severity === "critical"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : severity === "high"
                              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                              : severity === "medium"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              : "bg-green-500/20 text-green-300 border border-green-500/30"
                          }`}
                        >
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 md:col-span-2"
            >
              <h3 className="text-gray-200 font-semibold mb-4">
                System Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Reports this month</span>
                  <span className="text-xl font-bold text-white">
                    {stats.recentActivity.reportsThisMonth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">New users this month</span>
                  <span className="text-xl font-bold text-white">
                    {stats.recentActivity.newUsersThisMonth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active users (7 days)</span>
                  <span className="text-xl font-bold text-white">
                    {stats.recentActivity.activeUsers}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Mobile view - Cards */}
            <div className="block md:hidden space-y-4">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {u.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {u.email}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full flex-shrink-0 ${
                        u.role === "admin"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-gray-700 text-gray-300 border border-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div>
                      <div className="text-xs text-gray-400">Reports</div>
                      <div className="text-sm font-semibold text-white">
                        {Math.max(0, u.reportsCount ?? 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Points</div>
                      <div className="text-sm font-semibold text-white">
                        {u.ecoPoints}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Joined</div>
                      <div className="text-sm font-semibold text-white">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`change-role-${u._id}`}
                      className="block text-xs text-gray-400 mb-1"
                    >
                      Change Role
                    </label>
                    <select
                      id={`change-role-${u._id}`}
                      name="role"
                      value={u.role}
                      onChange={(e) =>
                        handleUpdateUserRole(u._id, e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Reports
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Eco Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-white">
                                {u.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              u.role === "admin"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-gray-700 text-gray-300 border border-gray-600"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {Math.max(0, u.reportsCount ?? 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {u.ecoPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            id={`role-table-${u._id}`}
                            name="role"
                            value={u.role}
                            onChange={(e) =>
                              handleUpdateUserRole(u._id, e.target.value)
                            }
                            className="bg-gray-700 border border-gray-600 text-white rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Report Management ({reports.length})
                  </h3>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setReportFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportFilter === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All Reports
                </button>
                <button
                  onClick={() => setReportFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportFilter === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setReportFilter("verified")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportFilter === "verified"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setReportFilter("in-progress")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportFilter === "in-progress"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setReportFilter("resolved")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportFilter === "resolved"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Resolved
                </button>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Reporter
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Severity
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Admin Notes
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr
                        key={report._id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/reports/${report._id}`)}
                      >
                        <td className="py-4 px-4">
                          <div className="text-white font-medium hover:text-purple-400 transition-colors">
                            {report.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {report.wasteType}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white">
                            {report.reportedBy?.name}
                          </div>
                          {report.reportedBy?.role === "admin" && (
                            <span className="text-xs text-purple-400">
                              👑 Admin
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === "pending"
                                ? "bg-amber-900/30 text-amber-400 border border-amber-700"
                                : report.status === "verified"
                                ? "bg-blue-900/30 text-blue-400 border border-blue-700"
                                : report.status === "in-progress"
                                ? "bg-purple-900/30 text-purple-400 border border-purple-700"
                                : report.status === "resolved"
                                ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700"
                                : "bg-red-900/30 text-red-400 border border-red-700"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.severity === "low"
                                ? "bg-green-900/30 text-green-400 border border-green-700"
                                : report.severity === "medium"
                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                                : report.severity === "high"
                                ? "bg-orange-900/30 text-orange-400 border border-orange-700"
                                : "bg-red-900/30 text-red-400 border border-red-700"
                            }`}
                          >
                            {report.severity}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-400 text-sm max-w-xs truncate">
                            {report.adminNotes || "No notes"}
                          </div>
                        </td>
                        <td
                          className="py-4 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleOpenNotesModal(report)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Notes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => navigate(`/reports/${report._id}`)}
                    className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-medium mb-1 hover:text-purple-400 transition-colors">
                          {report.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {report.wasteType}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === "pending"
                            ? "bg-amber-900/30 text-amber-400"
                            : report.status === "verified"
                            ? "bg-blue-900/30 text-blue-400"
                            : report.status === "in-progress"
                            ? "bg-purple-900/30 text-purple-400"
                            : report.status === "resolved"
                            ? "bg-emerald-900/30 text-emerald-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-400">
                        By: {report.reportedBy?.name}
                      </span>
                      {report.reportedBy?.role === "admin" && (
                        <span className="text-xs text-purple-400">👑</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">
                        Admin Notes:
                      </span>
                      <p className="text-sm text-gray-300 mt-1">
                        {report.adminNotes || "No notes"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNotesModal(report);
                      }}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Notes
                    </button>
                  </div>
                ))}
              </div>

              {reports.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No reports found</p>
                </div>
              )}
            </div>

            {/* Admin Notes Modal */}
            {showNotesModal && selectedReport && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Admin Notes
                        </h3>
                        <p className="text-gray-400">
                          Report: {selectedReport.title}
                        </p>
                      </div>
                      <button
                        onClick={handleCloseNotesModal}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-400">Reporter</p>
                          <p className="text-white font-medium">
                            {selectedReport.reportedBy?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <p className="text-white font-medium capitalize">
                            {selectedReport.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Waste Type</p>
                          <p className="text-white font-medium">
                            {selectedReport.wasteType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Severity</p>
                          <p className="text-white font-medium capitalize">
                            {selectedReport.severity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="admin-notes-admin"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Admin Notes
                        </label>
                        <textarea
                          id="admin-notes-admin"
                          name="adminNotes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add internal notes about this report..."
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows="6"
                        />
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-500">
                            These notes are for internal tracking and reference.
                          </p>
                          <p className="text-xs text-yellow-400 font-medium">
                            \u26a0\ufe0f Important: If you plan to reject this
                            report, add a clear reason here. The user will see
                            your notes as the rejection reason.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveAdminNotes}
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Notes
                      </button>
                      <button
                        onClick={handleCloseNotesModal}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
