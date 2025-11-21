import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { MapPinIcon, FunnelIcon, MapIcon } from "@heroicons/react/24/outline";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    wasteType: searchParams.get("wasteType") || "",
    severity: searchParams.get("severity") || "",
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.wasteType) params.append("wasteType", filters.wasteType);
      if (filters.severity) params.append("severity", filters.severity);

      const response = await axios.get(`/api/reports?${params}`);
      setReports(response.data.data.reports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex gap-4 justify-between items-center sm:flex-row flex-col">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Waste Reports</h1>
            <p className="text-gray-600 mt-2">
              Community-reported waste sites across the city
            </p>
          </div>
          <Link
            to={`/map?${searchParams.toString()}`}
            className="btn btn-primary inline-flex text-center gap-2 w-44"
          >
            <MapIcon className="w-5 h-5 inline mr-1" />
            View on Map
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
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
                onChange={(e) => handleFilterChange("status", e.target.value)}
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
                onChange={(e) => handleFilterChange("severity", e.target.value)}
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
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="card text-center py-12">
            <MapPinIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or be the first to report waste
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="card card-hover">
                {report.images && report.images.length > 0 && (
                  <img
                    src={report.images[0].url}
                    alt={report.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex justify-between items-start gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg flex-1 break-words">
                    {report.title}
                  </h3>
                  <span
                    className={`badge badge-${report.status} flex-shrink-0`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {report.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{report.wasteType} waste</span>
                  <span className="capitalize">{report.severity} severity</span>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary-700">
                      {report.reportedBy?.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {report.reportedBy?.name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 justify-between">
                  <Link
                    to={`/reports/${report._id}`}
                    className="flex btn btn-outline text-sm py-2 align-middle text-center"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/map?report=${report._id}`}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors whitespace-nowrap"
                    title="View on map"
                  >
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    Map
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reports;
