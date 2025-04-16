import React from "react";

const LoadFiles = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500 hover:text-purple-500 transition p-2">
        {/* Ícono */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16l4-4m0 0l4 4m-4-4v12m13-12h-3m-4 0h-3m-4 0H3m16 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h16z"
          />
        </svg>

        {/* Texto */}
        <p className="font-semibold">Subir Archivos</p>
        <p className="text-sm">Arrastra y suelta o haz clic para buscar</p>
      </div>
    </div>
  );
};

export default LoadFiles;