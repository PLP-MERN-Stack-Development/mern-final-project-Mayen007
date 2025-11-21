import { useAuth } from "../context/AuthContext";
import {
  UserCircleIcon,
  MapPinIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            View your account details and environmental impact
          </p>
        </div>

        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="badge badge-verified">{user.role}</span>
                <span className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {user.role !== "admin" && (
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {user.ecoPoints}
              </p>
              <p className="text-gray-600">Eco Points</p>
            </div>
          )}

          <div
            className={`card text-center ${
              user.role === "admin" ? "md:col-span-2" : ""
            }`}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.max(0, user.reportsCount ?? 0)}
            </p>
            <p className="text-gray-600">Reports Submitted</p>
          </div>

          {user.role !== "admin" && (
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {Math.floor((user.ecoPoints || 0) / 50)}
              </p>
              <p className="text-gray-600">Sites Resolved</p>
            </div>
          )}

          {user.role === "admin" && (
            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              <p className="text-lg font-bold text-purple-600">Administrator</p>
              <p className="text-gray-600">Platform Manager</p>
            </div>
          )}
        </div>

        {/* Impact Summary */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Environmental Impact
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700">Points for Reporting</span>
              <span className="font-semibold text-primary-600">
                10 pts each
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700">Points for Verification</span>
              <span className="font-semibold text-primary-600">
                20 pts each
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-700">Points for Resolution</span>
              <span className="font-semibold text-primary-600">
                50 pts each
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
