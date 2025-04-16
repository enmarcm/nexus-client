import React from "react";

const ButtonUseTemplate = () => {
  return (
    <button
      className="bg-purple-500 text-white rounded-md px-8 py-3 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition w-full"
      style={{ boxSizing: "border-box" }}
    >
      Usar Plantilla
    </button>
  );
};

export default ButtonUseTemplate;