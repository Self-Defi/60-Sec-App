import React from "react";

const ExplainerVideo: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-xl shadow-black/60 border border-gray-800">
      <video
        src="https://ipfs.io/ipfs/bafybeih3x42itzuigx3dfw63pjg4mtpdtmc5u6mrtqhp4j5m6n2fnjjcdm"
        controls
        playsInline
        className="w-full h-auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ExplainerVideo;
