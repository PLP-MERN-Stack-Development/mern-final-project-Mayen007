import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useSocket } from "../context/SocketContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ReportDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { loading: loadingState, showLoading, hideLoading } = useLoading();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    fetchReport();
  }, [id]);

  // Subscribe to socket events for this report
  useEffect(() => {
    if (!socket) return;
    if (!report) return;

    // Join report room for targeted updates
    socket.emit("joinReport", report._id);

    const onReportUpdated = (updated) => {
      if (!updated || !updated._id) return;
      if (updated._id === report._id) {
        setReport(updated);
      }
    };

    const onReportDeleted = ({ id: deletedId }) => {
      if (deletedId === report._id) {
        // If the currently viewed report was deleted, navigate away
        navigate("/reports");
      }
    };

    const onUserPoints = (payload) => {
      if (!payload || !payload.userId) return;
      // Update ecoPoints display if the reporting user matches
      if (report.reportedBy && payload.userId === report.reportedBy._id) {
        setReport((prev) => ({
          ...prev,
          reportedBy: { ...prev.reportedBy, ecoPoints: payload.ecoPoints },
        }));
      }
    };

    socket.on("report:updated", onReportUpdated);
    socket.on("report:deleted", onReportDeleted);
    socket.on("user:points", onUserPoints);

    return () => {
      socket.emit("leaveReport", report._id);
      socket.off("report:updated", onReportUpdated);
      socket.off("report:deleted", onReportDeleted);
      socket.off("user:points", onUserPoints);
    };
  }, [socket, report, navigate]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`);
      setReport(response.data.data.report);
      setAdminNotes(response.data.data.report.adminNotes || "");
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!isAuthenticated) return;

    // If rejecting, check if admin notes exist
    if (newStatus === "rejected" && !adminNotes.trim()) {
      setShowRejectConfirm(true);
      return;
    }

    showLoading(`Updating status to ${newStatus}...`, "submit");
    setError("");

    try {
      const response = await axios.patch(`/api/reports/${id}/status`, {
        status: newStatus,
      });
      setReport(response.data.data.report);

      // Brief success delay
      setTimeout(() => {
        hideLoading();
      }, 300);
    } catch (error) {
      hideLoading();
      console.error("Failed to update status:", error);
      setError(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleRejectWithoutNotes = async () => {
    setShowRejectConfirm(false);
    showLoading("Updating status to rejected...", "submit");
    setError("");

    try {
      const response = await axios.patch(`/api/reports/${id}/status`, {
        status: "rejected",
      });
      setReport(response.data.data.report);

      // Brief success delay
      setTimeout(() => {
        hideLoading();
      }, 300);
    } catch (error) {
      hideLoading();
      console.error("Failed to update status:", error);
      setError(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    showLoading("Deleting report...", "delete");
    setError("");

    try {
      await axios.delete(`/api/reports/${id}`);

      // Show success briefly before navigation
      setTimeout(() => {
        hideLoading();
        navigate("/reports");
      }, 500);
    } catch (error) {
      hideLoading();
      console.error("Failed to delete report:", error);
      setError(error.response?.data?.message || "Failed to delete report");
    }
  };

  const handleSaveNotes = async () => {
    if (!user || user.role !== "admin") return;

    setIsSavingNotes(true);
    setNotesSaved(false);
    setError("");

    try {
      const response = await axios.patch(
        `/api/admin/reports/${id}/notes`,
        { adminNotes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReport(response.data.data.report);
      setAdminNotes(response.data.data.report.adminNotes || "");

      // Show success feedback
      setIsSavingNotes(false);
      setNotesSaved(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setNotesSaved(false);
      }, 3000);
    } catch (error) {
      setIsSavingNotes(false);
      setNotesSaved(false);
      console.error("Failed to save admin notes:", error);
      setError(error.response?.data?.message || "Failed to save admin notes");
    }
  };

  // Carousel navigation functions
  const nextImage = () => {
    if (report?.images) {
      setCurrentImageIndex((prev) =>
        prev === report.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (report?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? report.images.length - 1 : prev - 1
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const openLightbox = () => {
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;

      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, currentImageIndex]);

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Report Not Found
            </h2>
            <button
              onClick={() => navigate("/reports")}
              className="btn btn-primary"
            >
              Back to Reports
            </button>
          </div>
        </div>
      </>
    );
  }

  const isOwner = user?.id === report.reportedBy?._id;
  const isAdmin = user?.role === "admin";
  const canEdit = isOwner || isAdmin;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-1 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="card mb-6 px-1">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {report.title}
              </h1>
              <span className={`badge badge-${report.status}`}>
                {report.status}
              </span>
            </div>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete report"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Images Carousel */}
          {report.images && report.images.length > 0 && (
            <div className="mb-6">
              {/* Main Image Display */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 group">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={report.images[currentImageIndex].url}
                  alt={`${report.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover cursor-zoom-in"
                  onClick={openLightbox}
                />

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {report.images.length}
                </div>

                {/* Navigation Arrows - Only show if more than 1 image */}
                {report.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Zoom Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to enlarge
                </div>
              </div>

              {/* Thumbnail Strip - Only show if more than 1 image */}
              {report.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {report.images.map((image, index) => (
                    <button
                      key={image.publicId || index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-primary-600 ring-2 ring-primary-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700">{report.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Waste Type
              </h4>
              <p className="text-gray-900 capitalize">{report.wasteType}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Severity
              </h4>
              <p className="text-gray-900 capitalize">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    report.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : report.severity === "high"
                      ? "bg-orange-100 text-orange-800"
                      : report.severity === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {report.severity}
                </span>
              </p>
            </div>
            {(report.location?.address ||
              (report.location?.coordinates &&
                report.location.coordinates.length === 2)) && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  Location
                </h4>
                {report.location?.address ? (
                  <p className="text-gray-900 mb-1">
                    {report.location.address}
                  </p>
                ) : null}
                {report.location?.coordinates && (
                  <p className="text-sm text-gray-600">
                    Coordinates: {report.location.coordinates[1].toFixed(6)},{" "}
                    {report.location.coordinates[0].toFixed(6)}
                  </p>
                )}

                {/* Link to map - always available when coordinates exist */}
                <Link
                  to={`/map?report=${report._id}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <MapPinIcon className="w-4 h-4" />
                  View on Map
                </Link>
              </div>
            )}
            {report.estimatedVolume && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Estimated Volume
                </h4>
                <p className="text-gray-900">{report.estimatedVolume}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Date Reported
              </h4>
              <p className="text-gray-900">
                {new Date(report.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {report.updatedAt &&
              new Date(report.updatedAt).getTime() !==
                new Date(report.createdAt).getTime() && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Last Updated
                  </h4>
                  <p className="text-gray-900">
                    {new Date(report.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
          </div>

          {/* Resolution Notes */}
          {report.resolutionNotes && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                Resolution Notes
              </h4>
              <p className="text-green-800">{report.resolutionNotes}</p>
            </div>
          )}

          {/* Reporter Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">
              Reported By
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {report.reportedBy?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {report.reportedBy?.email}
                  </p>
                  {report.reportedBy?.role === "admin" ? (
                    <p className="text-sm text-purple-600 font-medium mt-1">
                      🛡️ Administrator
                    </p>
                  ) : (
                    <p className="text-sm text-primary-600 font-medium mt-1">
                      🌱 {report.reportedBy?.ecoPoints} eco points
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(0, report.reportedBy?.reportsCount ?? 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notes Section - Only visible to admins */}
          {user && user.role === "admin" && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PencilIcon className="w-5 h-5 text-purple-600" />
                  Admin Notes
                </h4>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  Admin Only
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <textarea
                  id="admin-notes"
                  name="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this report (visible only to administrators)..."
                  rows="6"
                  className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-600">
                      These notes are only visible to administrators and will
                      not be shown to regular users.
                    </p>
                    {notesSaved && (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium animate-fadeIn">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Notes saved!</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      isSavingNotes
                        ? "bg-gray-400 cursor-not-allowed"
                        : notesSaved
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isSavingNotes ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : notesSaved ? (
                      <span className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        Saved!
                      </span>
                    ) : (
                      "Save Notes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Actions - Admin Only */}
          {isAdmin && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-purple-600">Admin:</span> Update Status
              </h4>
              {report.status === "resolved" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    This issue has been resolved
                  </p>
                </div>
              ) : report.status === "rejected" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium flex items-center gap-2">
                    <XMarkIcon className="w-5 h-5" />
                    This report has been rejected
                  </p>
                  {report.adminNotes && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-sm font-semibold text-red-900 mb-1">
                        Rejection reason provided to user:
                      </p>
                      <p className="text-sm text-red-700 whitespace-pre-wrap bg-white p-2 rounded">
                        {report.adminNotes}
                      </p>
                    </div>
                  )}
                  {!report.adminNotes && (
                    <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                      <p className="text-sm text-yellow-800">
                        ⚠️ No rejection reason was provided. The user will not
                        know why their report was rejected.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {/* pending → verified */}
                  {report.status === "pending" && (
                    <button
                      onClick={() => handleStatusUpdate("verified")}
                      disabled={loadingState.isLoading}
                      className="btn btn-primary"
                    >
                      Mark as Verified
                    </button>
                  )}
                  {/* verified → in-progress */}
                  {report.status === "verified" && (
                    <button
                      onClick={() => handleStatusUpdate("in-progress")}
                      disabled={loadingState.isLoading}
                      className="btn btn-secondary"
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {/* in-progress → resolved */}
                  {report.status === "in-progress" && (
                    <button
                      onClick={() => handleStatusUpdate("resolved")}
                      disabled={loadingState.isLoading}
                      className="btn bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  {/* Any status can be marked as rejected */}
                  {report.status !== "rejected" &&
                    report.status !== "resolved" && (
                      <button
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={loadingState.isLoading}
                        className="btn bg-red-600 text-white hover:bg-red-700"
                      >
                        Mark as Rejected
                      </button>
                    )}
                </div>
              )}
            </div>
          )}

          {/* User Actions - Report Owner Only (Non-Admin) */}
          {isOwner && !isAdmin && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Your Report
              </h4>
              <div
                className={`border rounded-lg p-4 ${
                  report.status === "rejected"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <p
                  className={
                    report.status === "rejected"
                      ? "text-red-800 mb-4"
                      : "text-blue-800 mb-4"
                  }
                >
                  <strong>Current Status:</strong>{" "}
                  <span className={`badge badge-${report.status} ml-2`}>
                    {report.status}
                  </span>
                </p>
                <p
                  className={`text-sm mb-4 ${
                    report.status === "rejected"
                      ? "text-red-700"
                      : "text-blue-700"
                  }`}
                >
                  {report.status === "pending" &&
                    "Your report is awaiting admin verification."}
                  {report.status === "verified" &&
                    "Your report has been verified and is pending action."}
                  {report.status === "in-progress" &&
                    "Cleanup is in progress! Thanks for reporting."}
                  {report.status === "resolved" &&
                    "Great news! This issue has been resolved. You earned eco-points!"}
                  {report.status === "rejected" &&
                    "This report was not accepted."}
                </p>

                {/* Show rejection reason to user */}
                {report.status === "rejected" && report.adminNotes && (
                  <div className="mb-4 p-3 bg-white border border-red-300 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      Reason for rejection:
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {report.adminNotes}
                    </p>
                  </div>
                )}

                {report.status === "rejected" && !report.adminNotes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ No reason provided. Please contact support if you need
                      more information.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 justify-between items-center sm:flex-row flex-col">
                  <button
                    onClick={handleDelete}
                    className="btn bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-2 sm:w-auto w-full justify-center"
                  >
                    <TrashIcon className="w-5 h-5 inline mr-1" />
                    Delete Report
                  </button>
                  <Link
                    to="/create-report"
                    className="btn btn-outline sm:w-auto w-full text-center"
                  >
                    Report Another Issue
                  </Link>
                </div>
              </div>
            </div>
          )}

          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteConfirmed}
            title="Delete Report?"
            message="Are you sure you want to delete this report? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
          />

          <ConfirmDialog
            isOpen={showRejectConfirm}
            onClose={() => setShowRejectConfirm(false)}
            onConfirm={handleRejectWithoutNotes}
            title="Reject Without Reason?"
            message="You haven't added any admin notes explaining why this report is being rejected. The user will not know why their report was rejected. Are you sure you want to proceed without adding a reason?"
            confirmText="Reject Anyway"
            cancelText="Add Notes First"
            type="danger"
          />
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {showLightbox && report?.images && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors z-10"
                aria-label="Close lightbox"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                {currentImageIndex + 1} / {report.images.length}
              </div>

              {/* Main Image */}
              <motion.img
                key={currentImageIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={report.images[currentImageIndex].url}
                alt={`${report.title} - Image ${currentImageIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation Arrows - Only show if more than 1 image */}
              {report.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Thumbnail Strip */}
              {report.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 px-4">
                  {report.images.map((image, index) => (
                    <button
                      key={image.publicId || index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThumbnailClick(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-white ring-2 ring-white/50"
                          : "border-white/30 hover:border-white/60"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Keyboard Hints */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/70 text-xs text-center hidden sm:block">
                Use arrow keys to navigate • Press ESC to close
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ReportDetail;
