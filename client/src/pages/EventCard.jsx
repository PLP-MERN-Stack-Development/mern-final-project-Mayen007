import React from "react";
import { Link } from "react-router-dom";
import PlaceholderImage from "../components/PlaceholderImage";

const EventCard = ({ event }) => {
  const date = new Date(event.date).toLocaleDateString();
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="h-40 bg-gray-200">
        <PlaceholderImage alt={event.title} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {date} • {event.location}
        </p>
        <p className="text-gray-700 text-sm mb-4">
          {event.description?.slice(0, 100)}
          {event.description && event.description.length > 100 ? "…" : ""}
        </p>
        <div className="flex items-center justify-between">
          <Link to={`/events/${event._id}`} className="btn-primary text-sm">
            View Details
          </Link>
          <span className="font-bold text-blue-600">${event.price}</span>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
