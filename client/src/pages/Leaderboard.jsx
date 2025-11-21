import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { TrophyIcon, StarIcon } from "@heroicons/react/24/solid";
import { TrophyIcon as TrophyOutline } from "@heroicons/react/24/outline";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/users/leaderboard?limit=20");
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TrophyOutline className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-600 mt-2">
            Top contributors making a difference
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users yet</div>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer ${
                    index < 3
                      ? "bg-gradient-to-r from-primary-50 to-transparent border-2 border-primary-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {index === 0 && (
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        className="relative"
                      >
                        <TrophyIcon className="w-10 h-10 text-yellow-500" />
                      </motion.div>
                    )}
                    {index === 1 && (
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        className="relative"
                      >
                        <TrophyIcon className="w-10 h-10 text-gray-400" />
                      </motion.div>
                    )}
                    {index === 2 && (
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        className="relative"
                      >
                        <TrophyIcon className="w-10 h-10 text-amber-600" />
                      </motion.div>
                    )}
                    {index > 2 && (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-700">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">
                      {Math.max(0, user.reportsCount ?? 0)} reports submitted
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                      {user.ecoPoints}
                    </p>
                    <p className="text-xs text-gray-500">eco points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Leaderboard;
