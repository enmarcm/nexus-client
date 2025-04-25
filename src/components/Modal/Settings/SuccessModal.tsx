import React from "react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold text-green-500 mb-4">¡Éxito!</h2>
        <p className="text-gray-700">{message}</p>
        <button
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;