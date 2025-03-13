import { useState } from "react";
import "./css/LanguageSelector.css"; 

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Español");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-primaryLila text-white text-sm font-medium hover:bg-primaryLila-dark focus:outline-none transition-all duration-300 ease-in-out"
          onClick={toggleDropdown}
        >
          {selectedLanguage}
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
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform scale-95 opacity-0 dropdown-enter-active">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-300 ease-in-out hover:bg-opacity-75"
              onClick={() => handleLanguageChange("Español")}
            >
              Español
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-300 ease-in-out hover:bg-opacity-75"
              onClick={() => handleLanguageChange("Inglés")}
            >
              Inglés
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;