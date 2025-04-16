import React from "react";
import { FaFileExcel, FaFileAlt } from "react-icons/fa";

interface StepContentProps {
  step: string;
  phoneNumbers: string[];
  onPhoneNumberChange: (phoneNumbers: string[]) => void;
  validatePhoneNumber: (phone: string) => boolean;
  dragging: boolean;
  uploadedFile: File | null;
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filteredGroups: { id: string; name: string; members: number }[];
  selectedGroup: string | null;
  onGroupSelect: (id: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  phoneNumbers,
  onPhoneNumberChange,
  validatePhoneNumber,
  dragging,
  uploadedFile,
  onFileDrop,
  onFileUpload,
  searchQuery,
  onSearchQueryChange,
  filteredGroups,
  selectedGroup,
  onGroupSelect,
  onBack,
  onConfirm,
  confirmDisabled = false,
}) => {
  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers[index] = value;

    onPhoneNumberChange(updatedPhoneNumbers);

    // Si el usuario escribe en el último campo, agrega un nuevo campo vacío
    if (index === phoneNumbers.length - 1 && value.trim() !== "") {
      onPhoneNumberChange([...updatedPhoneNumbers, ""]);
    }
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    onPhoneNumberChange(updatedPhoneNumbers);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {step === "manual" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Ingresar manualmente</h2>
            <p className="text-gray-600 mb-4">
              Ingresa los números de teléfono de los destinatarios:
            </p>
            <div className="h-64 overflow-y-auto pr-2">
              {phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={phone}
                    placeholder="Número de teléfono"
                    className={`w-full p-2 border ${
                      phone && !validatePhoneNumber(phone)
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded`}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, e.target.value)
                    }
                  />
                  {phoneNumbers.length > 1 && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemovePhoneNumber(index)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {step === "archivo" && (
          <>
            <div
              className={`border-dashed border-2 ${
                dragging ? "border-purple-500" : "border-gray-300"
              } rounded-lg p-6 flex flex-col items-center justify-center`}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={onFileDrop}
            >
              <h2 className="text-xl font-semibold mb-4">Cargar Archivo</h2>
              <p className="text-gray-600 mb-4">
                Arrastra y suelta un archivo JSON o Excel aquí, o haz clic para
                seleccionarlo.
              </p>
              <input
                type="file"
                accept=".json, .xlsx"
                className="hidden"
                id="file-upload"
                onChange={onFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer"
              >
                Seleccionar archivo
              </label>
              {uploadedFile && (
                <div className="mt-4 flex items-center gap-4">
                  {uploadedFile.name.endsWith(".xlsx") ? (
                    <FaFileExcel className="text-green-500" size={24} />
                  ) : (
                    <FaFileAlt className="text-blue-500" size={24} />
                  )}
                  <span>{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </>
        )}

        {step === "grupo" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Seleccionar Grupo</h2>
            <p className="text-gray-600 mb-4">
              Busca y selecciona un grupo de destinatarios:
            </p>
            <input
              type="text"
              placeholder="Buscar grupo"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
            <ul className="w-full border border-gray-300 rounded p-4">
              {filteredGroups.map((group) => (
                <li
                  key={group.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    selectedGroup === group.id ? "bg-purple-100" : ""
                  }`}
                  onClick={() => onGroupSelect(group.id)}
                >
                  {group.name} - {group.members} destinatarios
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={onBack}
        >
          Atrás
        </button>
        <button
          className={`px-4 py-2 rounded text-white ${
            confirmDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default StepContent;