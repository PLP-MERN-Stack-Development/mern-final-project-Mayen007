import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPinIcon,
  ChartBarIcon,
  TrophyIcon,
  CheckCircleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const [userInitials, setUserInitials] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [impactStats, setImpactStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    activeUsers: 0,
    wasteCollected: 0,
  });
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  useEffect(() => {
    fetchUserInitials();
    fetchImpactStats();
  }, []);

  const fetchUserInitials = async () => {
    try {
      const response = await axios.get("/api/users/leaderboard?limit=5");
      const users = response.data.data.users;

      // Get initials from user names
      const initials = users.map((user) => {
        const names = user.name.split(" ");
        return names.map((n) => n[0].toUpperCase()).join("");
      });

      setUserInitials(initials);

      // Get total user count
      const statsResponse = await axios.get("/api/reports/stats/dashboard");
      setTotalUsers(statsResponse.data.data.stats.totalUsers || users.length);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Fallback to default initials
      setUserInitials(["S", "M", "A", "J", "K"]);
      setTotalUsers(12000);
    }
  };

  const fetchImpactStats = async () => {
    try {
      const statsResponse = await axios.get("/api/reports/stats/dashboard");
      const stats = statsResponse.data.data.stats;

      // Calculate waste collected, ensuring we have a valid number
      const totalReports = stats.totalReports || 1234;
      const wasteCollected = isNaN(totalReports)
        ? 2.5
        : (totalReports * 0.0021).toFixed(1);

      setImpactStats({
        totalReports: totalReports,
        resolvedReports: stats.resolvedReports || 856,
        activeUsers: stats.totalUsers || 2456,
        wasteCollected: wasteCollected,
      });
    } catch (error) {
      console.error("Failed to fetch impact stats:", error);
      // Fallback to default stats
      setImpactStats({
        totalReports: 1234,
        resolvedReports: 856,
        activeUsers: 2456,
        wasteCollected: 2.5,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-14 md:py-16 lg:py-20 overflow-hidden min-h-screen flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-48 h-48 md:w-72 md:h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-48 h-48 md:w-72 md:h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center md:text-left"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                >
                  <span className="text-sm font-semibold">
                    🌍 Building Sustainable Cities - SDG 11
                  </span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                  Building <br />
                  <span className="text-green-300">Cleaner Cities,</span>
                  <br />
                  Together
                </h1>
                <p className="text-md sm:text-xl md:text-2xl mb-8 sm:mb-10 text-primary-50 max-w-3xl leading-relaxed font-light">
                  <span className="font-semibold">Report.</span> Track. Earn
                  rewards. Build cleaner cities together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  {authLoading ? (
                    <div className="h-8 w-40 rounded-md bg-white/10 animate-pulse" />
                  ) : isAuthenticated ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/create-report"
                          className="btn bg-white text-primary-700 hover:bg-green-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-green-500/50 transition-all duration-300 relative overflow-hidden group"
                        >
                          <span className="relative z-10">
                            Create Report ✨
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/reports"
                          className="btn bg-white/10 hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold border-2 border-white/50 backdrop-blur-md transition-all duration-300"
                        >
                          View Reports
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/register"
                          className="btn bg-white text-primary-700 hover:bg-green-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-green-500/50 transition-all duration-300 relative overflow-hidden group"
                        >
                          <span className="relative z-10">
                            Get Started Free →
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/login"
                          className="btn w-48 bg-white/10 hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold border-2 border-white/50 backdrop-blur-md transition-all duration-300"
                        >
                          Sign in
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Community Members Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 mt-12"
                >
                  <div className="flex -space-x-3">
                    {userInitials.slice(0, 5).map((initials, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className="w-12 h-12 bg-gradient-to-r from-primary-400 to-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg cursor-pointer"
                        style={{ zIndex: 5 - index }}
                      >
                        <span className="text-white text-sm font-bold">
                          {initials}
                        </span>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.4 }}
                      className="w-12 h-12 bg-white border-3 border-primary-300 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-primary-600 text-xs font-bold">
                        +
                        {totalUsers > 1000
                          ? `${Math.floor(totalUsers / 1000)}K`
                          : totalUsers}
                      </span>
                    </motion.div>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">
                      Join{" "}
                      {totalUsers > 1000
                        ? `${Math.floor(totalUsers / 1000)}K+`
                        : `${totalUsers}+`}{" "}
                      members
                    </p>
                    <p className="text-primary-100 text-sm">
                      Making cities cleaner every day
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Cleanup Illustration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden md:flex justify-center items-center"
              >
                <div className="relative">
                  {/* SVG Illustration */}
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full max-w-lg drop-shadow-2xl"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Circle */}
                    <motion.circle
                      cx="250"
                      cy="250"
                      r="200"
                      fill="rgba(255, 255, 255, 0.1)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />

                    {/* Ground */}
                    <motion.ellipse
                      cx="250"
                      cy="420"
                      rx="180"
                      ry="20"
                      fill="rgba(255, 255, 255, 0.15)"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    />

                    {/* Person with Trash Bag */}
                    <motion.g
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      {/* Body */}
                      <rect
                        x="220"
                        y="280"
                        width="60"
                        height="100"
                        rx="30"
                        fill="#10b981"
                      />
                      {/* Head */}
                      <circle cx="250" cy="260" r="25" fill="#fbbf24" />
                      {/* Arm */}
                      <rect
                        x="280"
                        y="290"
                        width="40"
                        height="15"
                        rx="7"
                        fill="#10b981"
                      />
                      {/* Trash Bag */}
                      <path
                        d="M 320 280 Q 340 290 335 320 L 315 340 Q 310 350 300 345 L 285 335 Q 280 325 285 310 Z"
                        fill="#1f2937"
                      />
                      <circle cx="310" cy="315" r="3" fill="#16a34a" />
                    </motion.g>

                    {/* Recycling Bin */}
                    <motion.g
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.1 }}
                    >
                      <rect
                        x="140"
                        y="320"
                        width="50"
                        height="70"
                        rx="5"
                        fill="#16a34a"
                      />
                      <rect
                        x="135"
                        y="315"
                        width="60"
                        height="10"
                        rx="3"
                        fill="#22c55e"
                      />
                      {/* Recycling Symbol */}
                      <path
                        d="M 155 345 L 165 360 L 175 345 M 165 350 L 165 370"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle cx="165" cy="375" r="3" fill="white" />
                    </motion.g>

                    {/* Tree */}
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.3 }}
                      style={{ transformOrigin: "380px 390px" }}
                    >
                      {/* Trunk */}
                      <rect
                        x="370"
                        y="360"
                        width="20"
                        height="50"
                        fill="#92400e"
                      />
                      {/* Leaves */}
                      <circle cx="380" cy="345" r="30" fill="#22c55e" />
                      <circle cx="365" cy="355" r="25" fill="#16a34a" />
                      <circle cx="395" cy="355" r="25" fill="#16a34a" />
                    </motion.g>

                    {/* Sparkles */}
                    <motion.g
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        d="M 180 200 L 183 207 L 190 210 L 183 213 L 180 220 L 177 213 L 170 210 L 177 207 Z"
                        fill="#fbbf24"
                      />
                      <path
                        d="M 340 180 L 342 185 L 347 187 L 342 189 L 340 194 L 338 189 L 333 187 L 338 185 Z"
                        fill="#fbbf24"
                      />
                      <path
                        d="M 420 240 L 423 247 L 430 250 L 423 253 L 420 260 L 417 253 L 410 250 L 417 247 Z"
                        fill="#fbbf24"
                      />
                    </motion.g>

                    {/* Floating Leaves */}
                    <motion.g
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        d="M 100 280 Q 105 275 110 280 Q 105 285 100 280"
                        fill="#22c55e"
                        opacity="0.6"
                      />
                      <path
                        d="M 400 300 Q 405 295 410 300 Q 405 305 400 300"
                        fill="#16a34a"
                        opacity="0.6"
                      />
                    </motion.g>
                  </svg>

                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-300 rounded-full opacity-20 blur-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="#f9fafb"
              />
            </svg>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold text-sm mb-4"
              >
                🚨 The Crisis
              </motion.span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                2 Billion Tons of Waste
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Rising pollution. Zero accountability. Time to act.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl mb-4 relative z-10">🏙️</div>
                <div className="text-5xl font-black text-red-600 mb-3 relative z-10">
                  33%
                </div>
                <p className="text-gray-700 font-semibold text-lg relative z-10">
                  Waste Mismanaged
                </p>
                <div className="mt-4 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl mb-4 relative z-10">💨</div>
                <div className="text-5xl font-black text-red-600 mb-3 relative z-10">
                  45%
                </div>
                <p className="text-gray-700 font-semibold text-lg relative z-10">
                  Pollution Increase
                </p>
                <div className="mt-4 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl mb-4 relative z-10">📊</div>
                <div className="text-5xl font-black text-red-600 mb-3 relative z-10">
                  67%
                </div>
                <p className="text-gray-700 font-semibold text-lg relative z-10">
                  Reporting Gap
                </p>
                <div className="mt-4 h-1 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-green-600 text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-sm mb-4"
              >
                ✨ The Solution
              </motion.span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Community + Technology
              </h2>
              <p className="text-xl text-primary-50 max-w-2xl mx-auto">
                One platform. Real impact. Cleaner cities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <MapPinIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Report Instantly</h3>
                  <p className="text-primary-50 text-lg">
                    Snap. Pin. Submit. Track waste violations in real-time.
                  </p>
                  <div className="mt-6 flex items-center text-primary-200 font-semibold group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <ChartBarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Smart Analytics</h3>
                  <p className="text-primary-50 text-lg">
                    Heatmaps, insights, and data that drive cleanup priorities.
                  </p>
                  <div className="mt-6 flex items-center text-primary-200 font-semibold group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Earn Rewards</h3>
                  <p className="text-primary-50 text-lg">
                    Climb leaderboards. Get recognized. Make it fun.
                  </p>
                  <div className="mt-6 flex items-center text-primary-200 font-semibold group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works / Product Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">4 steps to cleaner cities</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <FeatureCard
                icon={
                  <MapPinIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600" />
                }
                title="1. Report"
                description="Photo + location. Done in 30 seconds."
              />
              <FeatureCard
                icon={
                  <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600" />
                }
                title="2. Verify"
                description="Community confirms. Admins approve."
              />
              <FeatureCard
                icon={
                  <ChartBarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600" />
                }
                title="3. Track"
                description="Real-time cleanup updates."
              />
              <FeatureCard
                icon={
                  <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600" />
                }
                title="4. Earn"
                description="Points, badges, leaderboard glory."
              />
            </div>
          </div>
        </section>

        {/* Target Market / Who It's For Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-green-700 overflow-hidden">
          {/* Animated decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] opacity-40"></div>
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6 border border-white/30"
              >
                <UserGroupIcon className="w-4 h-4" />
                Built For Everyone
              </motion.div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Who It's For
              </h2>
              <p className="text-xl text-primary-50 max-w-2xl mx-auto">
                Everyone plays a role in building cleaner communities
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TargetMarketCard
                icon={<UserGroupIcon className="w-8 h-8" />}
                title="Citizens"
                description="Report. Earn rewards. Make your neighborhood cleaner."
                color="primary"
              />
              <TargetMarketCard
                icon={<BuildingOfficeIcon className="w-8 h-8" />}
                title="Businesses"
                description="Show CSR impact. Engage employees. Build better communities."
                color="green"
              />
              <TargetMarketCard
                icon={<AcademicCapIcon className="w-8 h-8" />}
                title="Schools & NGOs"
                description="Educate students. Drive action. Measure impact."
                color="blue"
              />
              <TargetMarketCard
                icon={<GlobeAltIcon className="w-8 h-8" />}
                title="Government"
                description="Get data. Optimize resources. Respond faster."
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* Stats / Impact Metrics Section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
                className="inline-block mb-6"
              >
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-green-500 rounded-full text-sm font-bold shadow-lg">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Live Impact Tracker
                </span>
              </motion.div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
                Our Growing{" "}
                <span className="bg-gradient-to-r from-green-400 to-primary-400 bg-clip-text text-transparent">
                  Impact
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real numbers. Real change. Real community power.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <StatCard
                number={impactStats.totalReports.toLocaleString()}
                label="Reports Submitted"
                icon={<MapPinIcon className="w-8 h-8" />}
              />
              <StatCard
                number={impactStats.resolvedReports.toLocaleString()}
                label="Sites Cleaned"
                icon={<CheckCircleIcon className="w-8 h-8" />}
              />
              <StatCard
                number={impactStats.activeUsers.toLocaleString()}
                label="Active Members"
                icon={<UserGroupIcon className="w-8 h-8" />}
              />
              <StatCard
                number={`${impactStats.wasteCollected}`}
                label="Tons Waste Collected"
                icon={<TrophyIcon className="w-8 h-8" />}
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us / Competitive Advantage Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50">
          {/* Decorative background elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-green-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg"
              >
                <SparklesIcon className="w-4 h-4" />
                Our Advantage
              </motion.div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Why{" "}
                <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  Reviwa
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Four pillars that make us the leader in civic engagement
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center p-8 rounded-2xl bg-white border border-primary-100 shadow-lg group-hover:shadow-2xl group-hover:border-primary-300 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-primary-500/50"
                  >
                    <UserGroupIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Community-Driven
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    By the people, for the people
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center p-8 rounded-2xl bg-white border border-blue-100 shadow-lg group-hover:shadow-2xl group-hover:border-blue-300 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-blue-500/50"
                  >
                    <BoltIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Tech-Enabled
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    AI + maps + analytics
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center p-8 rounded-2xl bg-white border border-green-100 shadow-lg group-hover:shadow-2xl group-hover:border-green-300 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-green-500/50"
                  >
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Transparent
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Open data, verified results
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center p-8 rounded-2xl bg-white border border-purple-100 shadow-lg group-hover:shadow-2xl group-hover:border-purple-300 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-purple-500/50"
                  >
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Scalable
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Neighborhood → City → Nation
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Impact / Results Section */}
        <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                The Impact
              </h2>
              <p className="text-lg text-gray-600">
                Real numbers. Real change.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-xl p-6 text-white text-center"
              >
                <div className="text-4xl font-bold mb-2">
                  {impactStats.wasteCollected}T
                </div>
                <p className="text-primary-100">Waste Collected</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl shadow-xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-gray-900 mb-2">94%</div>
                <p className="text-gray-600">Resolved in 7 Days</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl p-6 text-white text-center"
              >
                <div className="text-4xl font-bold mb-2">150+</div>
                <p className="text-green-100">Communities</p>
              </motion.div>
            </div>

            {/* SDG Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Supporting SDG 11
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Every report contributes to sustainable cities and communities
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-left">
                <div className="flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Cleaner air</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Green spaces</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Data-driven planning</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About / Team Highlight Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold mb-4 text-sm">
                  About Us
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Mission-Driven Impact
                </h2>
                <p className="text-gray-600 mb-6">
                  Empowering communities through technology. Building cleaner
                  cities through collective action.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    Community First
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Data-Driven
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Scalable
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">2020</div>
                  <p className="text-sm text-primary-100">Founded</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">15+</div>
                  <p className="text-sm text-green-100">Cities</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">50K+</div>
                  <p className="text-sm text-blue-100">Users</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">100+</div>
                  <p className="text-sm text-purple-100">Partners</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-green-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Community Voices
              </motion.div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                What Our{" "}
                <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  Community
                </span>{" "}
                Says
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real stories from real change-makers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Quote icon decoration */}
                <div className="absolute -top-4 -left-4 text-6xl text-primary-200 font-serif">
                  "
                </div>

                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-primary-200">
                  {/* Star rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "Reviwa has transformed how our neighborhood tackles waste.
                    We've cleaned up 15 illegal dumping sites in just 3 months!"
                  </p>

                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg shadow-lg">
                      SA
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        Sarah Anderson
                      </h4>
                      <p className="text-sm text-gray-600">
                        Community Volunteer
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Quote icon decoration */}
                <div className="absolute -top-4 -left-4 text-6xl text-green-200 font-serif">
                  "
                </div>

                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-green-200">
                  {/* Star rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "The gamification aspect is genius! My students compete to
                    report and clean up waste. It's education and action
                    combined."
                  </p>

                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg shadow-lg">
                      MK
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        Michael Kim
                      </h4>
                      <p className="text-sm text-gray-600">
                        Environmental Activist
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Quote icon decoration */}
                <div className="absolute -top-4 -left-4 text-6xl text-blue-200 font-serif">
                  "
                </div>

                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
                  {/* Star rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "Reviwa provides invaluable data for urban planning. We can
                    now prioritize cleanup efforts based on real community
                    input."
                  </p>

                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg shadow-lg">
                      PN
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        Priya Nair
                      </h4>
                      <p className="text-sm text-gray-600">
                        City Council Member
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Newsletter / Contact Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-green-700 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImhvbmV5Y29tYiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cG9seWdvbiBwb2ludHM9IjIwLDAgMzAsMTAgMzAsMzAgMjAsNDAgMTAsMzAgMTAsMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaG9uZXljb21iKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6 border border-white/30"
              >
                <HeartIcon className="w-4 h-4" />
                Stay Connected
              </motion.div>

              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Stay in the Loop
              </h2>
              <p className="text-xl text-primary-50 mb-10">
                Impact stories delivered to your inbox
              </p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="max-w-md mx-auto mb-12"
              >
                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                  <input
                    type="email"
                    id="subscribe-email"
                    name="email"
                    aria-label="Subscribe email"
                    placeholder="Your email address"
                    className="flex-1 px-4 sm:px-6 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-4 rounded-xl font-bold whitespace-nowrap shadow-lg hover:shadow-green-500/50 transition-all"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </motion.form>

              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex justify-center space-x-4 mb-10"
              >
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all border border-white/30 shadow-lg"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all border border-white/30 shadow-lg"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all border border-white/30 shadow-lg"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-all border border-white/30 shadow-lg"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-6 text-white"
              >
                <a
                  href="mailto:hello@reviwa.org"
                  className="flex items-center gap-2 hover:text-primary-100 font-medium transition-colors"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  hello@reviwa.org
                </a>
                <a
                  href="mailto:support@reviwa.org"
                  className="flex items-center gap-2 hover:text-primary-100 font-medium transition-colors"
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
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  support@reviwa.org
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-green-500 rounded-full text-sm font-bold mb-8 shadow-2xl"
              >
                <TrophyIcon className="w-4 h-4" />
                Join 10,000+ Change-Makers
              </motion.div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
                Ready to Make{" "}
                <span className="bg-gradient-to-r from-green-400 via-primary-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
                  Impact
                </span>
                ?
              </h2>
              <p className="text-xl sm:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto">
                Join the movement. Start reporting today.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {authLoading ? (
                  <div className="h-14 w-48 rounded-xl bg-white/10 animate-pulse inline-block" />
                ) : isAuthenticated ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/create-report"
                        className="relative group inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all overflow-hidden"
                      >
                        <span className="relative z-10">Create Report</span>
                        <svg
                          className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 text-lg font-bold rounded-xl hover:bg-white/20 transition-all shadow-xl"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/register"
                        className="relative group inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-green-500 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-primary-500/50 transition-all overflow-hidden"
                      >
                        <span className="relative z-10">Get Started</span>
                        <svg
                          className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className="inline-flex items-center text-center gap-2 w-52 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 text-lg font-bold rounded-xl hover:bg-white/20 transition-all shadow-xl"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Earn rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Make real impact</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-white font-bold text-lg mb-3">
                  <span className="bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent">
                    Reviwa
                  </span>
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Community-driven waste management platform
                </p>
                <div className="flex space-x-2">
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/Mayen007/reviwa"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm">
                  Platform
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/reports"
                      className="hover:text-white transition-colors"
                    >
                      Reports
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/map"
                      className="hover:text-white transition-colors"
                    >
                      Map
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leaderboard"
                      className="hover:text-white transition-colors"
                    >
                      Leaderboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm">
                  Company
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Impact
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm">
                  Support
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Help
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:support@reviwa.org"
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400 text-center sm:text-left">
                &copy; {new Date().getFullYear()} Reviwa. Building sustainable
                cities. ♻️
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                title="Back to top"
                aria-label="Back to top"
              >
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="card card-hover text-center group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="p-3 sm:p-4 bg-primary-50 rounded-2xl group-hover:bg-primary-100 transition-all duration-300 group-hover:scale-110 transform">
          {icon}
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

const StatCard = ({ number, label, icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group relative"
  >
    {/* Glassmorphism card background */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl group-hover:shadow-primary-500/20 transition-all duration-300"></div>

    {/* Content */}
    <div className="relative p-8">
      {icon && (
        <motion.div
          className="flex justify-center mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-green-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-primary-500/50 transition-shadow">
            {icon}
          </div>
        </motion.div>
      )}
      <div className="text-center">
        <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-primary-100 to-white bg-clip-text text-transparent mb-3 group-hover:from-primary-200 group-hover:via-white group-hover:to-green-200 transition-all duration-300">
          {number}
        </div>
        <div className="text-primary-100 text-lg sm:text-xl font-semibold tracking-wide">
          {label}
        </div>
      </div>
    </div>

    {/* Decorative corner accents */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-transparent rounded-br-2xl rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-400/20 to-transparent rounded-tl-2xl rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </motion.div>
);

const TargetMarketCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600 shadow-primary-500/50",
    green: "from-green-500 to-green-600 shadow-green-500/50",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/50",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -12, scale: 1.05 }}
      className="group relative"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 group-hover:bg-white/15 transition-all duration-300"></div>

      {/* Content */}
      <div className="relative p-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-16 h-16 bg-gradient-to-br ${
            colorClasses[color]
          } rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:${
            colorClasses[color].split(" ")[1]
          } transition-shadow`}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-50 transition-colors">
          {title}
        </h3>
        <p className="text-primary-100 text-sm leading-relaxed">
          {description}
        </p>

        {/* Decorative corner accent */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-2xl rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
