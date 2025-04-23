import React, { useState } from "react";

interface UploadAttachmentsChangeProps {
  onFileUpload: (files: FileList) => void; // Cambiar para manejar múltiples archivos
}

const UploadAttachmentsChange: React.FC<UploadAttachmentsChangeProps> = ({ onFileUpload }) => {
  const [fileNames, setFileNames] = useState<string[]>([]); // Estado para los nombres de los archivos cargados

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const names = Array.from(files).map((file) => file.name);
      setFileNames(names); // Actualiza los nombres de los archivos cargados
      onFileUpload(files); // Llama a la función pasada como prop con el FileList
    }
  };

  const handleCancel = () => {
    setFileNames([]); // Limpia los nombres de los archivos cargados
  };

  return (
    <div className="w-full flex flex-col gap-2 h-20">
      {fileNames.length === 0 ? (
        <label
          htmlFor="attachment-upload"
          className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500 hover:text-purple-500 transition p-2"
        >
          {/* Ícono */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16l4-4m0 0l4 4m-4-4v12m13-12h-3m-4 0h-3m-4 0H3m16 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h16z"
            />
          </svg>

          {/* Texto */}
          <p className="font-semibold">Subir Archivos Adjuntos</p>
          <p className="text-sm">Haz clic para buscar</p>
          <input
            id="attachment-upload"
            type="file"
            multiple // Permitir múltiples archivos
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="w-full h-full border border-gray-300 rounded-md flex flex-col justify-between px-4 bg-gray-50">
          <ul className="text-gray-500 text-sm">
            {fileNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
          <button
            className="text-red-500 text-sm hover:underline self-end"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadAttachmentsChange;