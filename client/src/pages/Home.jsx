import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Events Near You
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Find workshops, conferences, concerts and more. Register or buy
          tickets in a few clicks.
        </p>
        <Link
          to="/events"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition"
        >
          Browse Events
        </Link>
      </div>
    </section>
  );
};

export default Home;
