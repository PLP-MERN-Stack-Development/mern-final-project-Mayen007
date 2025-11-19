import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/events");
    } catch (err) {
      setError(err.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Login</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-label="Login form"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                aria-label="Email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-label="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <button
              type="submit"
              className={`btn-primary w-full py-2 hover:cursor-pointer ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && (
              <p
                className="text-red-600 text-sm font-medium"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
