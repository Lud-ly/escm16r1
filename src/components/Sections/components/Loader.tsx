import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        className="animate-spin"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#6E0B14"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r="15"
          stroke="#eee"
          strokeWidth="4"
          fill="none"
          strokeDasharray="60, 100"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-center text-gray-500 text-sm">Chargement...</p>
    </div>
  );
};

export default Loader;
