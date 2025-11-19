import React from "react";
import PlaceholderImage from "../components/PlaceholderImage";

const EventDetailsUpdated = ({ event, onRegister }) => {
  if (!event) return null;
  const date = new Date(event.date).toLocaleDateString();
  return (
    <>
      <article className="event-details card">
        <div className="event-media">
          <PlaceholderImage alt={event.title} />
        </div>
        <div className="event-body">
          <h2>{event.title}</h2>
          <p className="meta">
            {date} • {event.time} • {event.location}
          </p>
          <p className="excerpt">{event.description}</p>
          <div className="card-actions">
            <button className="btn primary" onClick={onRegister}>
              Register
            </button>
            <div className="price">${event.price}</div>
          </div>
        </div>
      </article>
    </>
  );
};

export default EventDetailsUpdated;
