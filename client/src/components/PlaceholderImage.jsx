import React from "react";

const PlaceholderImage = ({ alt = "Event image" }) => (
  <div className="placeholder-image" role="img" aria-label={alt}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="100%" height="100%" fill="#e9eef6" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#7b8aa3"
        fontSize="20"
      >
        Image
      </text>
    </svg>
  </div>
);

export default PlaceholderImage;
