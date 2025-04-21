import React, { useState } from "react";
import { FaFileExcel, FaFileAlt } from "react-icons/fa";
import * as XLSX from "xlsx";

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
  filteredGroups: { id: string; name: string; members: Array<string> }[];
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
  const [invalidPhoneNumbers, setInvalidPhoneNumbers] = useState<string[]>([]);

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

  const handleFileRead = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (file.type === "application/json") {
        try {
          const parsedData = JSON.parse(data as string);
          if (Array.isArray(parsedData)) {
            processPhoneNumbers(parsedData);
          } else {
            alert("El archivo JSON no tiene el formato correcto.");
          }
        } catch (error) {
          alert("Error al leer el archivo JSON.");
        }
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as string[][];
        const phoneNumbersFromXlsx = parsedData
          .map((row) => row[0])
          .filter((phone) => typeof phone === "string");
        processPhoneNumbers(phoneNumbersFromXlsx);
      }
    };

    if (file.type === "application/json") {
      reader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      reader.readAsBinaryString(file);
    }
  };

  const processPhoneNumbers = (numbers: string[]) => {
    const validNumbers = numbers.filter((phone) => validatePhoneNumber(phone));
    const invalidNumbers = numbers.filter(
      (phone) => !validatePhoneNumber(phone)
    );
    onPhoneNumberChange(validNumbers);
    setInvalidPhoneNumbers(invalidNumbers);
  };

  const handleConfirm = () => {
    if (step === "manual") {
      // Eliminar SIEMPRE el último elemento del arreglo
      const updatedPhoneNumbers = phoneNumbers.slice(0, -1);
      onPhoneNumberChange(updatedPhoneNumbers);
    }

    // Confirmar la acción
    onConfirm();
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
                    placeholder="04121704005"
                    className={`w-full p-2 border ${
                      phone && !validatePhoneNumber(phone)
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded`}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, e.target.value)
                    }
                  />
                  {phoneNumbers.length > 1 && phone.trim() !== "" && (
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileRead(file);
                }}
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

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Números válidos:</h3>
              <ul className="list-disc list-inside">
                {phoneNumbers.map((phone, index) => (
                  <li key={index} className="text-green-600">
                    {phone}
                  </li>
                ))}
              </ul>
            </div>

            {invalidPhoneNumbers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-red-600">
                  Números inválidos:
                </h3>
                <ul className="list-disc list-inside">
                  {invalidPhoneNumbers.map((phone, index) => (
                    <li key={index} className="text-red-600">
                      {phone}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
            <ul className="w-full border border-gray-300 rounded p-4 relative">
              {filteredGroups.map((group) => (
                <li
                  key={group.id}
                  className={`relative group p-2 hover:bg-gray-100 cursor-pointer ${
                    selectedGroup === group.id ? "bg-purple-100" : ""
                  }`}
                  onClick={() => onGroupSelect(group.id)}
                >
                  {group.name} - {group.members.length} destinatarios
                  {/* Tooltip para mostrar los números de teléfono */}
                  <div
                    className="absolute top-0 left-full ml-2 w-64 p-2 bg-white border border-gray-300 rounded shadow-lg text-sm text-gray-700 hidden group-hover:block z-10"
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <h3 className="font-semibold mb-2">Números del grupo:</h3>
                    <ul className="list-disc list-inside">
                      {group.members.map((phone, index) => (
                        <li key={index}>{phone}</li>
                      ))}
                    </ul>
                  </div>
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
          onClick={handleConfirm}
          disabled={confirmDisabled}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default StepContent;
