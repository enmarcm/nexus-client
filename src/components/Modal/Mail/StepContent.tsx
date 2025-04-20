import React, { useState } from "react";
import { FaFileExcel, FaFileAlt } from "react-icons/fa";
import * as XLSX from "xlsx";

interface StepContentProps {
  step: string;
  emails: string[];
  onEmailChange: (emails: string[]) => void;
  validateEmail: (email: string) => boolean;
  dragging: boolean;
  uploadedFile: File | null;
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileUpload: (file: File) => void;
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
  emails,
  onEmailChange,
  validateEmail,
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
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [localUploadedFile, setLocalUploadedFile] = useState<File | null>(uploadedFile);

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;

    onEmailChange(updatedEmails);

    // Si el usuario escribe en el último campo, agrega un nuevo campo vacío
    if (index === emails.length - 1 && value.trim() !== "") {
      onEmailChange([...updatedEmails, ""]);
    }
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    onEmailChange(updatedEmails);
  };

  const handleFileRead = async (file: File) => {
    setLocalUploadedFile(file);
    onFileUpload(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      console.log("Archivo leído:", data); // Depuración: Verificar contenido del archivo

      if (file.type === "application/json") {
        try {
          const parsedData = JSON.parse(data as string);
          console.log("Datos JSON parseados:", parsedData);

          if (Array.isArray(parsedData)) {
            const extractedEmails = parsedData
              .map((item: any) => item)
              .filter((email: string) => typeof email === "string");
            console.log("Correos extraídos del JSON:", extractedEmails); // Depuración
            processEmails(extractedEmails);
          } else {
            alert("El archivo JSON no tiene el formato correcto.");
          }
        } catch (error) {
          console.error("Error al leer el archivo JSON:", error); // Depuración
          alert("Error al leer el archivo JSON.");
        }
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        try {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
          }) as string[][];
          console.log("Datos Excel parseados:", parsedData); // Depuración

          const extractedEmails = parsedData
            .slice(1) // Ignorar la primera fila (encabezado)
            .map((row) => row[0])
            .filter((email) => typeof email === "string");
          console.log("Correos extraídos del Excel:", extractedEmails); // Depuración
          processEmails(extractedEmails);
        } catch (error) {
          console.error("Error al leer el archivo Excel:", error); // Depuración
          alert("Error al leer el archivo Excel.");
        }
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

  const processEmails = (emailsFromFile: string[]) => {
    console.log("Procesando correos:", emailsFromFile); // Depuración

    const validEmails = emailsFromFile.filter((email) => validateEmail(email));
    const invalidEmails = emailsFromFile.filter((email) => !validateEmail(email));

    console.log("Correos válidos:", validEmails); // Depuración
    console.log("Correos inválidos:", invalidEmails); // Depuración

    // Actualizar los correos válidos e inválidos
    onEmailChange([...emails, ...validEmails]); // Agregar los correos válidos al estado global
    setInvalidEmails(invalidEmails); // Actualizar los correos inválidos en el estado local
  };

  const handleConfirm = () => {
    if (step === "manual") {
      const updatedEmails = emails.filter((email, index) => {
        return index !== emails.length - 1 || email.trim() !== "";
      });
      onEmailChange(updatedEmails);
    }
    onConfirm();
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex-1 overflow-y-auto">
        {step === "manual" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Ingresar manualmente</h2>
            <p className="text-gray-600 mb-4">
              Ingresa los correos electrónicos de los destinatarios:
            </p>
            <div className="h-64 overflow-y-auto pr-2">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2 mb-4">
                  <input
                    type="email"
                    value={email}
                    placeholder="Correo electrónico"
                    className={`w-full p-2 border ${
                      email && !validateEmail(email)
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded`}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  {emails.length > 1 && email.trim() !== "" && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveEmail(index)}
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

              {localUploadedFile ? (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-4">
                    {localUploadedFile.name.endsWith(".xlsx") ? (
                      <FaFileExcel className="text-green-500" size={24} />
                    ) : (
                      <FaFileAlt className="text-blue-500" size={24} />
                    )}
                    <span className="text-gray-700 font-medium">
                      {localUploadedFile.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tamaño: {(localUploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">
                  No se ha cargado ningún archivo.
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Correos válidos:</h3>
              <div className="max-h-40 overflow-y-auto">
                <ul className="list-disc list-inside">
                  {emails.map((email, index) => (
                    <li key={index} className="text-green-600">
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {invalidEmails.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-red-600">
                  Correos inválidos:
                </h3>
                <ul className="list-disc list-inside">
                  {invalidEmails.map((email, index) => (
                    <li key={index} className="text-red-600">
                      {email}
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

      <div className="flex justify-between mt-4 border-t pt-4">
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