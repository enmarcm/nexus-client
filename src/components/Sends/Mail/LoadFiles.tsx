import React, { useState } from "react";

interface LoadFilesProps {
  onFileUpload?: (file: File) => void; // Prop opcional para manejar la carga de archivos
}

const LoadFiles: React.FC<LoadFilesProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null); // Estado para el nombre del archivo cargado

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name); // Actualiza el nombre del archivo cargado
      if (onFileUpload) {
        onFileUpload(file); // Llama a la función pasada como prop si está definida
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del navegador
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name); // Actualiza el nombre del archivo cargado
      if (onFileUpload) {
        onFileUpload(file); // Llama a la función pasada como prop si está definida
      }
    }
  };

  const handleCancel = () => {
    setFileName(null); // Limpia el nombre del archivo cargado
  };

  return (
    <div className="w-full flex flex-col gap-2 h-20">
      {!fileName ? (
        <div
          className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500 hover:text-purple-500 transition p-2"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
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
            <p className="font-semibold">Subir Archivos</p>
            <p className="text-sm">Arrastra y suelta o haz clic para buscar</p>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json, .xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="w-full h-full border border-gray-300 rounded-md flex items-center justify-between px-4 bg-gray-50">
          <span className="text-gray-500 text-sm">{fileName}</span>
          <button
            className="text-red-500 text-sm hover:underline"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default LoadFiles;