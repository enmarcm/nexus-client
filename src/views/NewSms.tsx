import React, { useState } from "react";
import Layout from "../components/Layout";
import ButtonSend from "../components/Sends/ButtonSend";
import ButtonUseTemplate from "../components/Sends/ButtonUseTemplate";
import TextEdit from "../components/Sends/TextEdit";

const NewSms = () => {
  const [content, setContent] = useState(""); // Contenido del editor
  const [variables, setVariables] = useState<string[]>([]); // Variables detectadas
  const [fileLoaded, setFileLoaded] = useState(false); // Estado para el archivo cargado

  return (
    <Layout title="Mensajes de Texto">
      <div
        className="w-full flex bg-gray-100 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* COLUMNA 1 */}
        <div className="w-8/12 h-full flex flex-col bg-white rounded-md shadow-lg p-6 gap-6">
          {/* Encabezado */}
          <div className="w-full">
            <ButtonUseTemplate type="sms" setContent={setContent} />
          </div>

          {/* Editor de texto */}
          <TextEdit
            editorType="text" // Solo texto
            content={content}
            setContent={setContent}
            setVariables={setVariables}
          />

          {/* Botón enviar */}
          <div className="w-full h-24">
            <ButtonSend /> {/* Botón de enviar ocupa todo el ancho */}
          </div>
        </div>

        {/* COLUMNA 2 */}
        <div className="w-4/12 h-full flex flex-col gap-4">
          {/* Previsualización */}
          <div className="w-full h-2/5 flex flex-col gap-4 p-6 bg-gray-50 rounded-md shadow-md">
            <h1 className="text-xl font-bold text-gray-700">
              Previsualización
            </h1>
            <div className="w-full h-full border border-gray-300 rounded-md p-4 overflow-auto bg-gray-100">
              <pre className="text-gray-700 whitespace-pre-wrap">{content}</pre>
            </div>
          </div>

          {/* Variables detectadas */}
          <div className="w-full h-2/5 flex flex-col gap-4 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Variables detectadas
            </h2>
            <ul className="list-disc list-inside text-gray-700 overflow-auto">
              {variables.length > 0 ? (
                variables.map((variable, index) => (
                  <li key={index} className="text-sm">
                    {variable}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No se han detectado variables.</p>
              )}
            </ul>
          </div>

          {/* Cargar datos */}
          <div className="w-full h-1/5 flex flex-col gap-4 p-6 bg-white rounded-md shadow-md">
            {!fileLoaded ? (
              // Mostrar solo el botón "Cargar datos" si no hay archivo cargado
              <button
                className="bg-primaryLila text-white rounded-md px-4 py-2 hover:bg-purple-600 transition-all"
                onClick={() => setFileLoaded(true)} // Simula la carga del archivo
              >
                Cargar datos
              </button>
            ) : (
              // Mostrar progreso de carga si ya hay un archivo cargado
              <>
                <div className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-between px-4 bg-gray-50">
                  <span className="text-gray-500 text-sm">
                    Nombre del archivo cargado
                  </span>
                  <button
                    className="text-red-500 text-sm hover:underline"
                    onClick={() => setFileLoaded(false)} // Cancela la carga
                  >
                    Cancelar
                  </button>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: "50%" }} // Simula el progreso de carga
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewSms;
