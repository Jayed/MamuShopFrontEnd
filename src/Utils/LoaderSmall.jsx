import React from "react";

const LoaderSmall = () => {
  return (
    // Loader
    <div className="flex flex-col items-center justify-center h-full space-y-2 mt-2">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default LoaderSmall;
