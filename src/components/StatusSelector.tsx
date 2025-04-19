import { useState } from "react";

const StatusSelector = ({ status, setStatus }: { status: string; setStatus: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setIsOpen(false);
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "fallidos":
        return "bg-red-500 text-white hover:bg-red-600";
      case "proceso":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "exitosos":
        return "bg-green-500 text-white hover:bg-green-600";
      default:
        return "bg-gray-300 text-gray-700 hover:bg-gray-400";
    }
  };

  return (
    <div className="relative inline-block text-left 0">
      <div>
        <button
          type="button"
          className={`inline-flex justify-between items-center w-48 rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-300 ease-in-out ${getStatusColor(
            status
          )} ${isOpen ? "ring-2 ring-gray-300" : ""}`}
          onClick={toggleDropdown}
        >
          {status === "fallidos" && "Fallidos"}
          {status === "proceso" && "Proceso"}
          {status === "exitosos" && "Exitosos"}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform scale-95 opacity-100">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-300 ease-in-out"
              onClick={() => handleStatusChange("fallidos")}
            >
              Fallidos
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-300 ease-in-out"
              onClick={() => handleStatusChange("proceso")}
            >
              En Proceso
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-300 ease-in-out"
              onClick={() => handleStatusChange("exitosos")}
            >
              Exitosos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSelector;