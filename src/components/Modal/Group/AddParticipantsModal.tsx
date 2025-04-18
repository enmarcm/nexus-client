import React, { useState } from "react";

interface AddParticipantsModalProps {
  tipo: string;
  nombre: string;
  onClose: () => void;
  onBack: () => void;
  onCreateGroup: (participants: string[]) => void;
}

const AddParticipantsModal: React.FC<AddParticipantsModalProps> = ({
  tipo,
  nombre,
  onClose,
  onBack,
  onCreateGroup,
}) => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateInput = (value: string) => {
    if (tipo === "SMS") {
      const phoneRegex = /^(0412|0424|0414|0426|0416)\d{7}$/;
      return phoneRegex.test(value);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
  };

  const handleAddParticipant = () => {
    if (!inputValue.trim()) {
      setErrorMessage(
        `Por favor, ingresa un ${tipo === "SMS" ? "teléfono" : "correo"}.`
      );
      return;
    }
    if (!validateInput(inputValue.trim())) {
      setErrorMessage(
        `El ${tipo === "SMS" ? "teléfono" : "correo"} ingresado no es válido.`
      );
      return;
    }
    setParticipants((prev) => [...prev, inputValue.trim()]);
    setInputValue("");
    setErrorMessage(""); // Limpia el mensaje de error
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateGroup = () => {
    if (participants.length === 0) {
      setErrorMessage("Por favor, agrega al menos un participante.");
      return;
    }
    onCreateGroup(participants);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()} // Cierra el modal al hacer clic fuera
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative flex flex-col h-96">
        {/* Botón de cierre y botón de atrás */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onBack}
          >
            ← Atrás
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

       

        <div className="flex  gap-6 h-full">
          {/* Columna izquierda: Participantes agregados */}
          <div className="flex flex-col w-1/2">

          <h2 className="text-lg font-semibold mb-4">Agregar Participantes</h2>
        <p className="text-sm text-gray-600 mb-6">
          Grupo: <strong>{nombre}</strong> ({tipo})
        </p>

            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Participantes Agregados
            </h3>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="bg-purple-200 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-red-500 hover:text-white cursor-pointer"
                  onClick={() => handleRemoveParticipant(index)}
                >
                  {participant}
                  <span className="font-bold">✕</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha: Agregar nuevo participante */}
          <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Agregar {tipo === "SMS" ? "Teléfono" : "Correo"}
              </h3>
              <div className="flex  flex-col gap-2 ">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ingresa un ${
                    tipo === "SMS" ? "teléfono" : "correo"
                  }`}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                  className="px-4 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-pink-600"
                  onClick={handleAddParticipant}
                >
                  Agregar
                </button>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
              )}
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={handleCreateGroup}
        >
          Crear Grupo
        </button>
      </div>
    </div>
  );
};

export default AddParticipantsModal;
