import React from "react";
import EventCard from "./EventCard";

const EventsUpdated = ({ events }) => {
  if (!events || events.length === 0) return <p>No upcoming events</p>;
  return (
    <section className="events-grid">
      {events.map((ev) => (
        <EventCard key={ev._id} event={ev} />
      ))}
    </section>
  );
};

export default EventsUpdated;
