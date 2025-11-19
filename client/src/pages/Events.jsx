import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import EventCard from "./EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        if (mounted) setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvents();

    const socket = io("http://localhost:5000");
    socket.on("registration", () => {
      fetchEvents();
    });

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, []);

  if (loading)
    return <div className="text-center py-12">Loading events...</div>;

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Events;
