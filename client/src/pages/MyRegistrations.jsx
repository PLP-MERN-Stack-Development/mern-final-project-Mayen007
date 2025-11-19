import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchRegistrations = async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/registrations"
          );
          setRegistrations(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user)
    return (
      <p className="text-center py-12 text-gray-600">
        Please login to view your registrations
      </p>
    );
  if (loading)
    return (
      <p className="text-center py-12 text-gray-600">
        Loading registrations...
      </p>
    );

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        My Registrations
      </h2>
      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No registrations yet</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {registrations.map((reg) => (
            <li
              key={reg._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-600 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {reg.event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(reg.event.date).toLocaleDateString()} at{" "}
                    {reg.event.location}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadge(
                    reg.status
                  )}`}
                >
                  {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Quantity
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {reg.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    ${reg.quantity * reg.event.price}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MyRegistrations;
