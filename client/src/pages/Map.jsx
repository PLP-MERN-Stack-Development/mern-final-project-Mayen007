import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FunnelIcon,
  MapPinIcon,
  XMarkIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useSocket } from "../context/SocketContext";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on status
const createCustomIcon = (status) => {
  const colors = {
    pending: "#f59e0b", // yellow
    verified: "#3b82f6", // blue
    "in-progress": "#f97316", // orange
    resolved: "#10b981", // green
    rejected: "#ef4444", // red
  };

  const color = colors[status] || colors.pending;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        ">📍</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Component to recenter map when location changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);
  return null;
};

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([0.3476, 32.5825]); // Default: Kampala, Uganda
  const [highlightedReportId, setHighlightedReportId] = useState(
    searchParams.get("report")
  );
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    wasteType: searchParams.get("wasteType") || "",
    severity: searchParams.get("severity") || "",
  });
  const socket = useSocket();

  useEffect(() => {
    fetchReports();
    getUserLocation();
  }, []);

  // Socket listeners to keep map in sync
  useEffect(() => {
    if (!socket) return;

    const onReportCreated = (newReport) => {
      if (!newReport || !newReport._id) return;
      setReports((prev) => {
        // Avoid duplicates
        if (prev.find((r) => r._id === newReport._id)) return prev;
        return [newReport, ...prev];
      });
    };

    const onReportUpdated = (updated) => {
      if (!updated || !updated._id) return;
      setReports((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    };

    const onReportDeleted = ({ id }) => {
      if (!id) return;
      setReports((prev) => prev.filter((r) => r._id !== id));
    };

    const onBulkUpdated = ({ ids, status }) => {
      // Simple strategy: refetch reports to keep UI consistent
      fetchReports();
    };

    socket.on("report:created", onReportCreated);
    socket.on("report:updated", onReportUpdated);
    socket.on("report:deleted", onReportDeleted);
    socket.on("reports:bulkUpdated", onBulkUpdated);

    return () => {
      socket.off("report:created", onReportCreated);
      socket.off("report:updated", onReportUpdated);
      socket.off("report:deleted", onReportDeleted);
      socket.off("reports:bulkUpdated", onBulkUpdated);
    };
  }, [socket]);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  // Handle highlighting specific report from URL
  useEffect(() => {
    if (highlightedReportId && reports.length > 0) {
      const report = reports.find((r) => r._id === highlightedReportId);
      if (report && report.location?.coordinates) {
        setMapCenter([
          report.location.coordinates[1],
          report.location.coordinates[0],
        ]);
      }
    }
  }, [highlightedReportId, reports]);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports");
      setReports(response.data.data.reports);

      // Center map on first report if available and no specific report is highlighted
      if (!highlightedReportId && response.data.data.reports.length > 0) {
        const firstReport = response.data.data.reports[0];
        if (firstReport.location?.coordinates) {
          setMapCenter([
            firstReport.location.coordinates[1],
            firstReport.location.coordinates[0],
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          // Only set map center to user location if no specific report is highlighted
          if (!highlightedReportId) {
            setMapCenter(location);
          }
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters.wasteType) {
      filtered = filtered.filter((r) => r.wasteType === filters.wasteType);
    }
    if (filters.severity) {
      filtered = filtered.filter((r) => r.severity === filters.severity);
    }

    setFilteredReports(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      wasteType: "",
      severity: "",
    });
    // Clear filter params but keep report param if exists
    const newParams = new URLSearchParams();
    if (highlightedReportId) {
      newParams.set("report", highlightedReportId);
    }
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPinIcon className="w-7 h-7 text-primary-600 inline" />
                Waste Reports Map
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredReports.length} reports shown on map
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/reports?${searchParams.toString()}`}
                className="btn btn-outline flex items-center gap-2"
              >
                <ListBulletIcon className="w-5 h-5 inline mr-1" />
                <span className="hidden sm:inline">View List</span>
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5 inline mr-1" />
                <span className="hidden sm:inline">Filters</span>
                {(filters.status || filters.wasteType || filters.severity) && (
                  <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {
                      [
                        filters.status,
                        filters.wasteType,
                        filters.severity,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>
            </div>
          </div>{" "}
          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-7xl mx-auto mt-4 bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filter Reports</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="filter-status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="filter-status"
                    name="status"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="filter-wasteType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Waste Type
                  </label>
                  <select
                    id="filter-wasteType"
                    name="wasteType"
                    value={filters.wasteType}
                    onChange={(e) =>
                      handleFilterChange("wasteType", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">All</option>
                    <option value="plastic">Plastic</option>
                    <option value="organic">Organic</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Glass</option>
                    <option value="electronic">Electronic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="filter-severity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Severity
                  </label>
                  <select
                    id="filter-severity"
                    name="severity"
                    value={filters.severity}
                    onChange={(e) =>
                      handleFilterChange("severity", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap position={mapCenter} />

            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: "user-location-marker",
                  html: `
                  <div style="
                    width: 20px;
                    height: 20px;
                    background-color: #3b82f6;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  "></div>
                `,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold text-blue-600">
                      📍 You are here
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Report Markers with Clustering */}
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={50}
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
              zoomToBoundsOnClick={true}
            >
              {filteredReports.map((report) => {
                if (!report.location?.coordinates) return null;

                const position = [
                  report.location.coordinates[1], // latitude
                  report.location.coordinates[0], // longitude
                ];

                const isHighlighted = report._id === highlightedReportId;

                return (
                  <Marker
                    key={report._id}
                    position={position}
                    icon={createCustomIcon(report.status)}
                    eventHandlers={{
                      add: (e) => {
                        // Auto-open popup for highlighted report
                        if (isHighlighted) {
                          setTimeout(() => {
                            e.target.openPopup();
                          }, 300);
                        }
                      },
                    }}
                  >
                    <Popup maxWidth={280} className="custom-popup">
                      <div className="px-2 py-3 min-w-[240px] max-w-[280px]">
                        {report.images && report.images.length > 0 && (
                          <img
                            src={report.images[0].url}
                            alt={report.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-bold text-gray-900 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`badge badge-${report.status} text-xs whitespace-nowrap`}
                          >
                            {report.status}
                          </span>
                          <span className="text-xs text-gray-500 capitalize whitespace-nowrap">
                            {report.wasteType}
                          </span>
                          <span className="text-xs text-gray-500 capitalize whitespace-nowrap">
                            {report.severity}
                          </span>
                        </div>
                        <Link
                          to={`/reports/${report._id}`}
                          className="block w-full text-center bg-green-600 hover:bg-green-700 font-semibold rounded-lg px-4 py-2 text-sm transition-colors duration-200 no-underline"
                          style={{ color: "white" }}
                        >
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-24 right-6 bg-white rounded-lg shadow-lg p-4 z-[1000]">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">
              Report Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-700">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-700">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-700">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-700">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                <span className="text-xs text-gray-700">Your Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
