import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ChartBarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { HandRaisedIcon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        axios.get("/api/reports/stats/dashboard"),
        axios.get(`/api/reports/user/${user.id}?limit=5`),
      ]);

      setStats(statsRes.data.data.stats);
      setRecentReports(reportsRes.data.data.reports);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent flex items-center gap-2">
            Welcome back, {user?.name}!{" "}
            <motion.div
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            >
              <HandRaisedIcon className="w-8 h-8 text-primary-500" />
            </motion.div>
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your environmental impact
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role !== "admin" && (
            <StatCard
              icon={<ChartBarIcon className="w-8 h-8 text-primary-600" />}
              title="Your Eco Points"
              value={user?.ecoPoints || 0}
              color="primary"
            />
          )}
          {user?.role === "admin" && (
            <StatCard
              icon={<ShieldCheckIcon className="w-8 h-8 text-purple-600" />}
              title="Administrator"
              value="Platform Manager"
              color="purple"
            />
          )}
          <StatCard
            icon={<MapPinIcon className="w-8 h-8 text-blue-600" />}
            title="Reports Submitted"
            value={Math.max(0, user?.reportsCount ?? 0)}
            color="blue"
          />
          <StatCard
            icon={<CheckCircleIcon className="w-8 h-8 text-green-600" />}
            title="Total Resolved"
            value={stats?.resolved || 0}
            color="green"
          />
          <StatCard
            icon={<ClockIcon className="w-8 h-8 text-yellow-600" />}
            title="Pending"
            value={stats?.pending || 0}
            color="yellow"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link
            to="/create-report"
            className="card card-hover text-center group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors"
              >
                <MapPinIcon className="w-6 h-6 text-primary-600" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-2">Report Waste</h3>
              <p className="text-sm text-gray-600">
                Found illegal dumping? Report it now
              </p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="card card-hover text-center group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors"
              >
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-2">
                View All Reports
              </h3>
              <p className="text-sm text-gray-600">Browse community reports</p>
            </div>
          </Link>

          <Link
            to="/map"
            className="card card-hover text-center group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors"
              >
                <span className="text-2xl">🗺️</span>
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Interactive Map
              </h3>
              <p className="text-sm text-gray-600">View reports on map</p>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="card card-hover text-center group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors"
              >
                <span className="text-2xl">🏆</span>
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-2">Leaderboard</h3>
              <p className="text-sm text-gray-600">See top contributors</p>
            </div>
          </Link>
        </div>

        {/* Recent Reports */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Recent Reports
            </h2>
            <Link
              to="/reports"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPinIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No reports yet. Start making a difference today!</p>
              <Link
                to="/create-report"
                className="btn btn-primary mt-4 inline-block"
              >
                Create Your First Report
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <Link
                  key={report._id}
                  to={`/reports/${report._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge badge-${report.status}`}>
                      {report.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const getGradientClasses = () => {
    if (color === "purple") {
      return "from-purple-600 to-purple-400";
    }
    return "from-gray-900 to-gray-700 group-hover:from-primary-600 group-hover:to-primary-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="card group"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p
            className={`text-3xl font-bold bg-gradient-to-r ${getGradientClasses()} bg-clip-text text-transparent transition-all duration-300`}
          >
            {value}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>{icon}</motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
