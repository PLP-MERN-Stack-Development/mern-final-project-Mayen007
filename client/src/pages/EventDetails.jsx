import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import PlaceholderImage from "../components/PlaceholderImage";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        if (mounted) setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvent();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      alert("Please login to register");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/registrations", {
        eventId: id,
        ticketType: "standard",
        quantity: 1,
      });
      alert("Registered successfully!");
    } catch (err) {
      alert(err?.response?.data?.error || "Registration failed");
    }
  };

  if (loading)
    return <p className="text-center py-12 text-gray-600">Loading event...</p>;
  if (!event)
    return <p className="text-center py-12 text-gray-600">Event not found</p>;

  const date = new Date(event.date).toLocaleDateString();

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200">
            <PlaceholderImage alt={event.title} />
          </div>
          <div className="p-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {date} • {event.time} • {event.location}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {event.description}
            </p>
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handleRegister}
                className="btn-primary text-lg px-6 py-3 font-semibold"
              >
                Register Now
              </button>
              <div className="text-3xl font-bold text-blue-600">
                ${event.price}
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default EventDetails;
