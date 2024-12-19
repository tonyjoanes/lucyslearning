import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl shadow-lg text-center border border-blue-100">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="text-xl text-indigo-700 font-medium">Creating your quest... ✨</p>
        <p className="text-sm text-indigo-500 mt-2">Crafting magical questions just for you!</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;