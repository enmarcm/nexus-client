import React from "react";

interface ConfirmEditModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  templateName: string;
}

const ConfirmEditModal: React.FC<ConfirmEditModalProps> = ({ onConfirm, onCancel, templateName }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Confirmar Edición</h2>
        <p className="text-gray-700 mb-6">
          ¿Estás seguro de que deseas editar la plantilla <strong>{templateName}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEditModal;