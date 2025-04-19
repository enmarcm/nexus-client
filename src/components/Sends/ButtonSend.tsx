import React from "react";

interface ButtonSendProps {
  label?: string;
  onClick?: () => void; // onClick opcional
}

const ButtonSend: React.FC<ButtonSendProps> = ({ label = "ENVIAR", onClick }) => {
  return (
    <div className="h-full w-full">
      <button
        className="w-full h-full bg-green-500 text-white rounded-md px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        style={{ boxSizing: "border-box" }}
        onClick={onClick} // Ejecuta onClick si se proporciona
      >
        {label}
      </button>
    </div>
  );
};

export default ButtonSend;