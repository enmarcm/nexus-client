import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadFiles from "../components/Sends/LoadFiles";
import ButtonSend from "../components/Sends/ButtonSend";
import ButtonUseTemplate from "../components/Sends/ButtonUseTemplate";
import TextEdit from "../components/Sends/TextEdit";
import useFetcho from "../customHooks/useFetcho";
import { API_URL } from "../data/constants";
import * as XLSX from "xlsx"; // Para procesar archivos XLSX
import { useSmsDataGlobal } from "../context/SmsDataGlobal"; // Cambiado para SMS
import "./css/NewEmail.css"

interface RecipientData {
  telefono: string;
  variables: Record<string, string | number>;
}

const NewSms = () => {
  const fetchWithLoading = useFetcho();
  const { state } = useSmsDataGlobal(); // Obtener datos del contexto global
  const [content, setContent] = useState(""); // Contenido del editor
  const [variables, setVariables] = useState<string[]>([]); // Variables detectadas
  const [loading, setLoading] = useState(false); // Estado de carga
  const [responseMessage, setResponseMessage] = useState<string | null>(null); // Mensaje de respuesta
  const [fileLoaded, setFileLoaded] = useState(false); // Estado para el archivo cargado
  const [recipientData, setRecipientData] = useState<RecipientData[]>([]); // Datos procesados del archivo
  const [fileName, setFileName] = useState<string | null>(null); // Nombre del archivo cargado
  const navigate = useNavigate(); // Para redirigir después de la animación

  const sendSms = async (phone: string, personalizedContent: string) => {
    try {
      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "SMS",
          method: "send_sms",
          params: [phone, personalizedContent],
        },
      });
      console.log(`SMS enviado a ${phone}:`, response);
    } catch (error) {
      console.error(`Error enviando SMS a ${phone}:`, error);
    }
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (file.type === "application/json") {
        try {
          const parsedData = JSON.parse(data as string);
          if (Array.isArray(parsedData)) {
            setRecipientData(parsedData);
            setFileLoaded(true);
            setFileName(file.name);
            console.log("Datos cargados:", parsedData); // Mostrar los datos cargados en la consola
          } else {
            alert("El archivo JSON no tiene el formato correcto.");
          }
        } catch (error) {
          alert("Error al leer el archivo JSON.");
        }
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as string[][];
        const headers = parsedData[0];
        const rows = parsedData.slice(1);
        const formattedData = rows.map((row) => {
          const telefono = row[0] as string;
          const variables = headers.slice(1).reduce((acc, header, index) => {
            acc[header] = row[index + 1];
            return acc;
          }, {} as Record<string, string | number>);
          return { telefono, variables };
        });
        setRecipientData(formattedData);
        setFileLoaded(true);
        setFileName(file.name);
        console.log("Datos cargados:", formattedData); // Mostrar los datos cargados en la consola
      }
    };

    if (file.type === "application/json") {
      reader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      reader.readAsBinaryString(file);
    }
  };

  const replaceVariables = (
    template: string,
    variables: Record<string, string | number>
  ) => {
    let result = template;
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, String(variables[key]));
    });
    return result;
  };

  const handleSendSms = async () => {
    setLoading(true);
    setResponseMessage(null);

    try {
      // Verificar si el contenido usa variables
      const usesVariables = variables.length > 0;

      // Validar si se requiere un archivo de datos
      if (usesVariables && recipientData.length === 0) {
        throw new Error(
          "El contenido del SMS utiliza variables, pero no se ha cargado un archivo con datos."
        );
      }

      // Si no hay variables, enviar el SMS a los destinatarios del contexto global
      if (!usesVariables) {
        if (state.phoneNumbers.length === 0) {
          throw new Error("No hay destinatarios para enviar el SMS.");
        }

        for (const phone of state.phoneNumbers) {
          if (phone === "") continue;
          console.log(`Enviando a ${phone} sin variables.`);
          await sendSms(phone, content); // Enviar el contenido tal cual
        }
      } else {
        // Si hay variables, enviar SMS personalizados
        for (const recipient of recipientData) {
          const personalizedContent = replaceVariables(
            content,
            recipient.variables
          );
          console.log(
            `Enviando a ${recipient.telefono} con contenido:`,
            personalizedContent
          );
          await sendSms(recipient.telefono, personalizedContent);
        }
      }

      // Redirigir después de enviar
      setTimeout(() => {
        navigate("/sms");
      }, 1500); // Duración de la animación (1.5s)
    } catch (error: any) {
      console.error("Error al enviar los SMS:", error);
      setResponseMessage(error.message || "Error al enviar los SMS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Mensajes de Texto">
      <div
        className="w-full flex bg-gray-100 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* COLUMNA 1 */}
        <div className="w-8/12 h-full flex flex-col bg-white rounded-md shadow-lg p-4 gap-4">
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
          <div className="w-full h-20">
            <ButtonSend onClick={handleSendSms} /> {/* Botón para enviar SMS */}
          </div>
        </div>

        {/* COLUMNA 2 */}
        <div className="w-4/12 h-full flex flex-col gap-2">
          {/* Previsualización */}
          <div className="w-full h-2/5 flex flex-col gap-2 p-4 bg-white rounded-md shadow-md">
            <h1 className="text-lg font-bold text-gray-700">Previsualización</h1>
            <div className="w-full h-full border border-gray-300 rounded-md p-2 overflow-auto bg-gray-50">
              <pre className="text-gray-700 whitespace-pre-wrap text-sm">
                {content}
              </pre>
            </div>
          </div>

          {/* Variables detectadas */}
          <div className="w-full h-2/5 flex flex-col gap-2 p-4 bg-white rounded-md shadow-md">
            <h2 className="text-md font-semibold text-gray-700">
              Variables detectadas
            </h2>
            <ul className="list-disc list-inside text-gray-700 overflow-auto text-sm">
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
              <LoadFiles onFileUpload={handleFileUpload} />
            ) : (
              <div className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-between px-4 bg-gray-50">
                <span className="text-gray-500 text-sm">{fileName}</span>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => {
                    setFileLoaded(false);
                    setRecipientData([]);
                    setFileName(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Mensaje de respuesta */}
          {responseMessage && (
            <div className="w-full p-2 bg-gray-100 rounded-md text-center text-gray-700 text-sm">
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewSms;