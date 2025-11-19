import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-linear-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-2xl font-bold">
          Event<span className="text-blue-400">Hub</span>
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-blue-300 underline"
                  : "text-gray-100 hover:text-white"
              }`
            }
          >
            Events
          </NavLink>
          <NavLink
            to="/my-registrations"
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-blue-300 underline"
                  : "text-gray-100 hover:text-white"
              }`
            }
          >
            My Registrations
          </NavLink>
          {!user && (
            <NavLink
              to="/login"
              className="text-gray-100 hover:text-white transition"
            >
              Login
            </NavLink>
          )}
          {!user && (
            <NavLink
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition font-medium"
            >
              Sign Up
            </NavLink>
          )}
          {user && (
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-medium"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
