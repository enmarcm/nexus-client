import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupTypeOptions } from "../../../views/Groups";
import { API_URL } from "../../../data/constants";
import useFetcho from "../../../customHooks/useFetcho";
import { on } from "events";

interface AddParticipantsModalProps {
  members: any[];
  tipo: GroupTypeOptions;
  nombre: string;
  isEditMode: boolean; // Nueva prop para el modo del modal
  idGroup?: number; // ID del grupo si está en modo edición
  onClose: () => void;
  onBack: () => void;
  onCreateGroup: () => void;
  onRemoveMember: (id: number) => void; // Función para eliminar miembros
}

const AddParticipantsModal: React.FC<AddParticipantsModalProps> = ({
  members,
  tipo,
  nombre,
  isEditMode,
  idGroup,
  onClose,
  onBack,
  onCreateGroup,
  onRemoveMember,
}) => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipants, setNewParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false); // Estado para la animación de creación
  const [isSuccess, setIsSuccess] = useState(false); // Estado para mostrar éxito
  const fetchWithLoading = useFetcho();
  const navigate = useNavigate();

  const validateInput = (value: string) => {
    if (Number.parseInt(tipo.toString()) === 2) {
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
        `Por favor, ingresa un ${
          Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"
        }.`
      );
      return;
    }
    if (!validateInput(inputValue.trim())) {
      setErrorMessage(
        `El ${
          Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"
        } ingresado no es válido.`
      );
      return;
    }
    if(isEditMode){
      // Si está en modo edición, verifica si el participante ya existe
      const isDuplicate = members.some(
        (member) => member.content === inputValue.trim()
      );
      if (isDuplicate) {
        setErrorMessage(
          `El ${
            Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"
          } ya está en la lista.`
        );
        return;
      }
      setNewParticipants((prev) => [
        ...prev,
        inputValue.trim(),
      ]); // Agrega el nuevo participante a la lista de nuevos participantes
      setInputValue("");
      setErrorMessage(""); // Limpia el mensaje de error
      return;
    }
    setParticipants((prev) => [...prev, inputValue.trim()]);
    setInputValue("");
    setErrorMessage(""); // Limpia el mensaje de error
  };

  const handleRemoveParticipant = async (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));


    if (isEditMode) {
      // Si está en modo edición, también elimina de los miembros
      onRemoveMember(index);
      console.log("Miembro eliminado:", index);
      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "delete_member_group",
          params: {
            id_group: idGroup,
            id_saved: index,
          },
        },
      });
      console.log("Miembro eliminado exitosamente:", response);
      
    }
  };

  const handleRemoveNewParticipant = (index: number) => {
    setNewParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    if (participants.length === 0) {
      setErrorMessage("Por favor, agrega al menos un participante.");
      return;
    }
    setIsCreating(true); // Inicia la animación de creación
    try {
      // Llamada para crear el grupo y guardar participantes
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
            co_saved_list: participants,
          },
        },
      });

      console.log("Grupo creado exitosamente:", response);
      onCreateGroup()

      // Simula un retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        setIsCreating(false);
        setIsSuccess(true); // Muestra el mensaje de éxito

        setTimeout(() => {
          // Redirige a la sección de grupos después de mostrar el éxito
          navigate(`/groups`);
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error("Error al crear grupo:", error);
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    if (isEditMode) {
      // Lógica para guardar cambios en el grupo existente
      console.log("Guardando cambios en el grupo:", newParticipants);
      if (newParticipants.length == 0) {
        setTimeout(() => {
          // Redirige a la sección de grupos después de mostrar el éxito
          onCreateGroup()
        }, 2000);
        return;
      }

      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "add_to_group",
          params: {
            id_type: Number.parseInt(tipo.toString()),
            id_group: idGroup,
            co_saved: newParticipants,
          },
        },
      });
      console.log("Miembros agregados exitosamente:", response);
      onCreateGroup()
    } else {
      handleCreateGroup();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()} // Cierra el modal al hacer clic fuera
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative flex flex-col h-[28rem]">
        {/* Botón de cierre y botón de atrás */}
        <div className="flex justify-between items-center mb-4">
          {!isEditMode && <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onBack}
          >
            ← Atrás
          </button>}
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {isCreating ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
            <p className="mt-4 text-pink-500 font-semibold">Creando grupo...</p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="rounded-full h-16 w-16 bg-green-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <p className="mt-4 text-green-500 font-semibold">¡Grupo creado exitosamente!</p>
          </div>
        ) : (
          <div className="flex gap-6 h-full">
            {/* Columna izquierda: Participantes agregados */}
            <div className="flex flex-col w-1/2">
              <h2 className="text-lg font-semibold mb-4">Agregar Participantes</h2>
              <p className="text-sm text-gray-600 mb-6">
                Grupo: <strong>{nombre}</strong> (
                {Number.parseInt(tipo.toString()) === 2 ? "SMS" : "EMAIL"})
              </p>

              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Participantes Agregados
              </h3>
              <div
                className="flex flex-col gap-2 overflow-y-auto border p-2 rounded"
                style={{ maxHeight: "150px" }} // Alto máximo con scroll
              >
                {isEditMode ? (
    <>
      {/* Mostrar miembros existentes */}
      {members.length > 0 &&
        members.map((member) => (
          <div
            key={member.id}
            className="bg-purple-200 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-red-500 hover:text-white cursor-pointer"
            onClick={() => handleRemoveParticipant(member.id)}
          >
            {member.content}
            <span className="font-bold">✕</span>
          </div>
        ))}

      {/* Mostrar nuevos participantes */}
      {newParticipants.length > 0 &&
        newParticipants.map((participant, index) => (
          <div
            key={`new-${index}`}
            className="bg-green-200 text-green-700 px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-red-500 hover:text-white cursor-pointer"
            onClick={() => handleRemoveNewParticipant(index)}
          >
            {participant}
            <span className="font-bold">✕</span>
          </div>
        ))}
    </>
  ) : 
                participants.map((participant, index) => (
                  <div
                    key={index}
                    className="bg-purple-200 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-red-500 hover:text-white cursor-pointer"
                    onClick={() => handleRemoveParticipant(index)}
                  >
                    {participant}{'hola'}
                    <span className="font-bold">✕</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: Agregar nuevo participante */}
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Agregar{" "}
                {Number.parseInt(tipo.toString()) === 2 ? "telefono" : "correo"}
              </h3>
              <div className="flex flex-col gap-2">
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
        )}

        {!isCreating && !isSuccess && (
          <button
            className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={handleSave}
          >
           {isEditMode ? "Guardar Cambios" : "Crear Grupo"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddParticipantsModal;