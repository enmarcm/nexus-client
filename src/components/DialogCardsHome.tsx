import React from "react";

interface DialogCardsHomeProps {
  title: string;
  content: { title: string; value: string; type?: string; members?: string }[];
  onClose: () => void;
}

const DialogCardsHome: React.FC<DialogCardsHomeProps> = ({
  title,
  content,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Cantidad de elementos */}
        <p className="text-gray-600 mb-4">
          Total de elementos:{" "}
          <span className="font-semibold">{content.length}</span>
        </p>

        {/* Lista moderna */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto"
          style={{ maxHeight: "400px" }} // Alto máximo con scroll
        >
          {content.map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-gray-100 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-700">
                Nombre: <span className="text-gray-600">{item.value}</span>
              </span>
              {item.type && (
                <span className="font-medium text-gray-700">
                  Tipo: <span className="text-gray-600">{item.type}</span>
                </span>
              )}
              {item.members && (
                <span className="font-medium text-gray-700">
                  Miembros:{" "}
                  <span className="text-gray-600">{item.members}</span>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Botón de cierre */}
        <button
          className="mt-6 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-all"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DialogCardsHome;
