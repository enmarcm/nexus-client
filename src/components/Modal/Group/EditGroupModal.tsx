import React, { useState } from "react";

interface EditGroupModalProps {
  group: any;
  onSave: (updatedGroup: any) => void;
  onCancel: () => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ group, onSave, onCancel }) => {
  const [formData, setFormData] = useState(group);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Editar Grupo</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Miembros</label>
          <input
            type="number"
            name="miembros"
            value={formData.miembros}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;