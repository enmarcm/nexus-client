import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaTimes } from "react-icons/fa";
import { useEmailDataGlobal } from "../../../context/EmailDataGlobal";
import CardOptions from "../CardOptions";
import StepContent from "./StepContent";
import "../../css/ModalMail.css";
import useFetcho from "../../../customHooks/useFetcho";
import { API_URL } from "../../../data/constants";

const ModalMail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { dispatch } = useEmailDataGlobal();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [emails, setEmails] = useState<string[]>([""]);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<
    { id: string; name: string; members: string[] }[]
  >([]);

  const fetchWithLoading = useFetcho();

  const fetchGroups = async () => {
    try {
      const response = (await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "obtain_all_group",
        },
      })) as any;

      const smsGroups = response.filter(
        (item: any) => item.de_type === "email"
      );

      // Usar Promise.all para obtener los miembros de los grupos filtrados
      const mappedResponse = await Promise.all(
        smsGroups.map(async (item: any) => {
          const membersResponse = (await fetchWithLoading({
            url: `${API_URL}/toProcess`,
            method: "POST",
            body: {
              object: "GROUP",
              method: "obtain_member_group",
              params: {
                id_group: item.id_group,
              },
            },
          })) as any;

          const members = membersResponse.map((member: any) => member.content);

          return {
            id: item.id_group,
            name: item.de_group,
            total: item.total_saved,
            type: item.de_type,
            members,
          };
        })
      );

      console.log(mappedResponse);

      setGroups(mappedResponse);
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleNextStep = () => {
    if (selectedCard) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedCard(null);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleConfirm = () => {
    if (step === 2 && selectedCard === "manual") {
      console.log("Correos confirmados:", emails);
    } else if (step === 2 && selectedCard === "archivo") {
      console.log("Archivo confirmado:", uploadedFile);
      console.log("Correos confirmados:", emails);
    } else if (step === 2 && selectedCard === "grupo") {
      console.log("Grupo confirmado:", selectedGroup);
    }

    // Guardar los datos en el contexto global
    dispatch({ type: "SET_SELECTED_CARD", payload: selectedCard });
    dispatch({ type: "SET_EMAILS", payload: emails });
    dispatch({ type: "SET_UPLOADED_FILE", payload: uploadedFile });
    dispatch({ type: "SET_SELECTED_GROUP", payload: selectedGroup });

    // Redirigir a /emails/newEmail
    navigate("/emails/newEmail");
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${
        isClosing ? "modal-close-animation" : "modal-open-animation"
      }`}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-[55rem] h-[28rem] flex flex-col gap-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaTimes size={20} />
        </button>

        {step === 1 ? (
          <>
            <div className="flex gap-4 items-center justify-start border-b-2 border-gray-300 pb-4">
              <div>
                <FaEnvelope size={30} className="text-purple-500" />
              </div>
              <div className="flex flex-col justify-center items-start gap-2">
                <h2 className="text-xl font-semibold">
                  ¿A quién(es) deseas enviar?
                </h2>
                <p className="text-gray-500">
                  Selecciona los destinatarios para empezar a despachar
                </p>
              </div>
            </div>

            <CardOptions
              selectedCard={selectedCard}
              onCardSelect={setSelectedCard}
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={handleNextStep}
                disabled={!selectedCard}
              >
                Confirmar
              </button>
            </div>
          </>
        ) : (
          <StepContent
            step={selectedCard!}
            emails={emails}
            onEmailChange={(updatedEmails) => {
              setEmails(updatedEmails);
            }}
            validateEmail={(email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            dragging={dragging}
            uploadedFile={uploadedFile}
            onFileDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) setUploadedFile(file);
            }}
            onFileUpload={(e) => {
              const file = e.target.files?.[0];
              if (file) setUploadedFile(file);
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            filteredGroups={groups.filter((group) =>
              group.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            selectedGroup={selectedGroup}
            onGroupSelect={(id) => {
              setSelectedGroup(id);
              const group = groups.find((g) => g.id === id);
              if (group) {
                setEmails([...emails, ...group.members]);
              }
            }}
            onBack={handleBack}
            onConfirm={handleConfirm}
            confirmDisabled={selectedCard === "grupo" && !selectedGroup}
          />
        )}
      </div>
    </div>
  );
};

export default ModalMail;
