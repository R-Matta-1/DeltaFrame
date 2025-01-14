import React from "react";

const MediaDisplay = ({ src, type, style }) => {
  if (!src) {
    return null; // Handle case where no source is provided
  }

  if (type.startsWith("video/")) {
    return <video controls src={src} type={type} style={style} />;
  }

  if (type.startsWith("image/")) {
    return <img src={src} type={type} style={style} />;
  }

  if (type.startsWith("audio/")) {
    return (
      <audio
        controls
        src={src}
        type={type}
        style={style}
        alt="can't display audio?"
      />
    );
  }

  // Handle unsupported media types
  return null;
};

export default MediaDisplay;
