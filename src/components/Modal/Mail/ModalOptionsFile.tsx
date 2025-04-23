import React from "react";

interface ModalOptionsFilesProps {
  onAssignToAll: () => void;
  onUseDataFile: () => void; // Función para activar el uso del archivo de datos
  onClose: () => void;
  isDataFileLoaded: boolean; // Indica si el archivo de datos está cargado
}

const ModalOptionsFiles: React.FC<ModalOptionsFilesProps> = ({
  onAssignToAll,
  onUseDataFile,
  onClose,
  isDataFileLoaded,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Asignar archivos a destinatarios
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Selecciona cómo deseas asignar los archivos a los destinatarios.
        </p>
        <div className="flex flex-col gap-4">
          {/* Opción 1: Enviar los mismos archivos a todos */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onAssignToAll}
          >
            Enviar los mismos archivos a todos
          </button>

          {/* Opción 2: Usar archivo de datos */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={onUseDataFile}
          >
            Usar archivo de datos para asignar archivos
          </button>

          {/* Mensaje informativo */}
          {!isDataFileLoaded && (
            <p className="text-yellow-500 text-sm text-center">
              El archivo de datos aún no está cargado. Puede seleccionarlo más tarde antes de enviar los correos.
            </p>
          )}

          {/* Botón para cancelar */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOptionsFiles;