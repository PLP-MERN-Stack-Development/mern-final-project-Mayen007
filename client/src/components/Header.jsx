import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  // Move focus to hamburger button when closing sidebar
  const closeMenu = () => {
    setMenuOpen(false);
    setTimeout(() => {
      const btn = document.getElementById("hamburger-btn");
      if (btn) btn.focus();
    }, 0);
  };

  return (
    <>
      <header className="bg-linear-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold">
            Event<span className="text-blue-400">Hub</span>
          </NavLink>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
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
          {/* Hamburger for mobile */}
          <button
            id="hamburger-btn"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Mobile sidebar menu */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
            menuOpen ? "" : "pointer-events-none"
          }`}
          aria-hidden={menuOpen ? "false" : "true"}
          inert={!menuOpen}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
          />
          {/* Sidebar */}
          <aside
            className={`absolute left-0 top-0 h-full w-64 bg-slate-900 shadow-xl transform transition-transform duration-300 ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <NavLink
                to="/"
                className="text-2xl font-bold"
                onClick={closeMenu}
              >
                Event<span className="text-blue-400">Hub</span>
              </NavLink>
              <button
                className="w-8 h-8 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            <nav className="flex flex-col gap-2 px-6 py-6">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `font-medium py-2 px-2 rounded transition ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-100 hover:bg-slate-800"
                  }`
                }
                onClick={closeMenu}
              >
                Events
              </NavLink>
              <NavLink
                to="/my-registrations"
                className={({ isActive }) =>
                  `font-medium py-2 px-2 rounded transition ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-100 hover:bg-slate-800"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                My Registrations
              </NavLink>
              {!user && (
                <NavLink
                  to="/login"
                  className="text-gray-100 hover:bg-slate-800 py-2 px-2 rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
              )}
              {!user && (
                <NavLink
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded transition font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              )}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded transition font-medium"
                >
                  Logout
                </button>
              )}
            </nav>
          </aside>
        </div>
      </header>
    </>
  );
};

export default Header;
