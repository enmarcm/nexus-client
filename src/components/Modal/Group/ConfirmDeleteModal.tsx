import React from "react";

interface ConfirmDeleteModalProps {
  groupName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  groupName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => e.target === e.currentTarget && onCancel()} // Cierra el modal al hacer clic fuera
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar el grupo{" "}
          <strong>{groupName}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;