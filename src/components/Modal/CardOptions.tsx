import React from "react";
import { FaCheck } from "react-icons/fa";
import ManualIngresoSVG from "../../assets/manual-ingreso.svg";
import JsonIngresoSVG from "../../assets/json-ingreso.svg";
import GrupoIngresoSVG from "../../assets/grupo-ingreso.svg";

interface CardOptionsProps {
  selectedCard: string | null;
  onCardSelect: (card: string) => void;
}

const CardOptions: React.FC<CardOptionsProps> = ({ selectedCard, onCardSelect }) => {
  const cards = [
    {
      id: "manual",
      title: "Ingresar manualmente",
      description: "Ingresa los destinatarios de manera manual",
      image: ManualIngresoSVG,
    },
    {
      id: "archivo",
      title: "Cargar Archivo",
      description: "Sube un archivo XSLX o JSON donde indiques los correos destino",
      image: JsonIngresoSVG,
    },
    {
      id: "grupo",
      title: "Usar grupo",
      description: "Selecciona uno de tus grupos para despachar la información",
      image: GrupoIngresoSVG,
    },
  ];

  return (
    <div className="flex gap-8 items-center justify-between">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`w-[15rem] h-[15rem] flex flex-col items-center justify-center border ${
            selectedCard === card.id ? "border-purple-500 card-selected" : "border-gray-300"
          } rounded-lg p-4 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer relative`}
          onClick={() => onCardSelect(card.id)}
        >
          <div
            className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
              selectedCard === card.id
                ? "bg-purple-500 border-purple-500 flex items-center justify-center"
                : "bg-white border-gray-300"
            }`}
          >
            {selectedCard === card.id && <FaCheck className="text-white" size={12} />}
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-gray-600 text-md">{card.description}</p>
          </div>
          <div className="flex items-center justify-center">
            <img src={card.image} alt={card.title} className="object-contain" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardOptions;