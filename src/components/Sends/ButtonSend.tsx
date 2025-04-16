import React from "react";

const ButtonSend = () => {
  return (
    <div className="h-full w-full">
      <button
        className="w-full h-full bg-green-500 text-white rounded-md px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        style={{ boxSizing: "border-box" }}
      >
        ENVIAR
      </button>
    </div>
  );
};

export default ButtonSend;