import React from "react";

const Loader = () => {
  return (
    // Loader
    <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
      <p className="text-blue-500 text-lg font-semibold">Loading ...</p>
    </div>
  );
};

export default Loader;
