import React, { useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";

interface NewGroupModalProps {
  onClose: () => void;
  onNext: (groupData: { tipo: string; nombre: string }) => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ onClose, onNext }) => {
  const [tipo, setTipo] = useState("SMS");
  const [nombre, setNombre] = useState("");

  const handleNext = () => {
    if (!nombre.trim()) {
      alert("Por favor, ingresa un nombre para el grupo.");
      return;
    }
    onNext({ tipo, nombre });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Cierra el modal si se hace clic fuera de él
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleOverlayClick} // Detecta clics fuera del modal
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative flex flex-col">
        {/* Botón de cierre (X) */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Crear Nuevo Grupo</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Grupo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ingresa el nombre del grupo"
          />
        </div>
        <div className="flex justify-end gap-4 mt-12">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-[#FF69B4] text-white rounded-lg flex items-center gap-2 hover:bg-pink-600"
            onClick={handleNext}
          >
            Siguiente <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;