import React, { useState } from "react";
import { GroupTypeOptions } from "../../../views/Groups";
import { API_URL } from "../../../data/constants";
import useFetcho from "../../../customHooks/useFetcho";
// import { create } from "domain";

interface AddParticipantsModalProps {
  tipo: GroupTypeOptions;
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
  // onCreateGroup,
}) => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const  fetchWithLoading  = useFetcho();

  const validateInput = (value: string) => {
    if (tipo === 2) {
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
        `Por favor, ingresa un ${Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"}.`
      );
      return;
    }
    if (!validateInput(inputValue.trim())) {
      setErrorMessage(
        `El ${Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"} ingresado no es válido.`
      );
      return;
    }
    console.log("Participante agregado:", inputValue.trim());
    add_participant(inputValue.trim());
    setParticipants((prev) => [...prev, inputValue.trim()]);
    // console.log("Participantes:", participants);
    setInputValue("");
    setErrorMessage(""); // Limpia el mensaje de error
  };

  const add_participant = (participant: string) => {
    try {
      const response = fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "add_to_saved",
          params: {
            id_type: Number.parseInt(tipo.toString()),
            co_saved: participant
          }
        }
      })} catch (error) {
        console.error(`Error al agregar participante`, error);
      }
  }


  const handleRemoveParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateGroup = () => {
    if (participants.length === 0) {
      setErrorMessage("Por favor, agrega al menos un participante.");
      return;
    }
    console.log("Grupo creado con participantes:", participants);
    createGroup();
  };

    const createGroup = async () => {
      try {
        const response = await fetchWithLoading({
          url: `${API_URL}/toProcess`,
          method: "POST",
          body: {
            object: "GROUP",
            method: "create_group",
            params: {
              id_user: 1,
              id_type: Number.parseInt(tipo.toString()),
              de_group: nombre,
              co_saved_list: participants
            },
          },
        });
        // console.log(`Correo enviado a ${}:`, response);
      } catch (error) {
        console.error(`Error al crear grupo`, error);
      }
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
          Grupo: <strong>{nombre}</strong> ({Number.parseInt(tipo.toString()) === 2 ? "SMS" : "EMAIL"})
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
                Agregar {Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"}
              </h3>
              <div className="flex  flex-col gap-2 ">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ingresa un ${
                    Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"
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
