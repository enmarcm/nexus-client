import React, { useState } from "react";
import { StatusOptions } from "../../../views/Templates";


interface NewTemplateModalProps {
  onClose: () => void;
  onNext: (templateData: { tipo: StatusOptions; nombre: string }) => void; // Cambia tipo a StatusOptions
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({ onClose, onNext }) => {
  const [tipo, setTipo] = useState<StatusOptions>(StatusOptions.EMAIL); // Tipo por defecto
  const [nombre, setNombre] = useState<string>(""); // Nombre de la plantilla
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNext = () => {
    if (!nombre.trim()) {
      setErrorMessage("Por favor, ingresa un nombre para la plantilla.");
      return;
    }
    setErrorMessage(""); // Limpia el mensaje de error
    onNext({ tipo, nombre });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()} // Cierra el modal al hacer clic fuera
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative flex flex-col">
        {/* Botón de cierre */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Crear Nueva Plantilla</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Plantilla
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as StatusOptions)} // Convierte el valor a StatusOptions
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value={StatusOptions.EMAIL}>Email</option>
            <option value={StatusOptions.SMS}>SMS</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Plantilla
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre de la plantilla"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>

        <button
          className="w-full px-4 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-pink-600"
          onClick={handleNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default NewTemplateModal;