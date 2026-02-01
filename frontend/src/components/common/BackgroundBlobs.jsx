import React from 'react';
import './BackgroundBlobs.scss';

const BackgroundBlobs = React.memo(() => {
  return (
    <div className="background-blobs-container">
      {/* Blob 1 - Cyan */}
      <div className="bg-blob bg-blob-1" />

      {/* Blob 2 - Magenta/Red */}
      <div className="bg-blob bg-blob-2" />

      {/* Blob 3 - Deep Blue */}
      <div className="bg-blob bg-blob-3" />
    </div>
  );
});

export default BackgroundBlobs;
