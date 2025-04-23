import { useState } from "react";
import * as XLSX from "xlsx";
import useFetcho from "./useFetcho";
import { API_URL } from "../data/constants";

interface RecipientData {
  correo: string;
  variables: Record<string, string | number>;
  files?: string[]; // Archivos específicos para cada destinatario
}

const useEmailSender = (stateEmails: string[], navigate: Function) => {
  const fetchWithLoading = useFetcho();

  // Estados
  const [editorType, setEditorType] = useState<"html" | "text">("html");
  const [content, setContent] = useState(""); // Contenido del editor
  const [variables, setVariables] = useState<string[]>([]); // Variables detectadas
  const [responseMessage, setResponseMessage] = useState<string | null>(null); // Mensaje de respuesta
  const [subject, setSubject] = useState(""); // Asunto del correo
  const [isSending, setIsSending] = useState(false); // Estado para la animación de envío
  const [fileLoaded, setFileLoaded] = useState(false); // Estado para el archivo cargado
  const [recipientData, setRecipientData] = useState<RecipientData[]>([]); // Datos procesados del archivo
  const [fileName, setFileName] = useState<string | null>(null); // Nombre del archivo cargado
  const [attachments, setAttachments] = useState<File[]>([]); // Archivos adjuntos
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para mostrar el modal de éxito
  const [showAttachmentModal, setShowAttachmentModal] = useState(false); // Modal para asignar archivos
  const [useDataFileForAttachments, setUseDataFileForAttachments] =
    useState(false); // Estado para usar archivo de datos para asignar archivos

  // Función para enviar correos
  const sendEmails = async (
    emails: Array<{ to: string; subject: string; body: string }>
  ) => {
    try {
      const emailPayload = emails.map((email) => ({
        type: "EMAIL",
        content: {
          to: email.to,
          subject: email.subject,
          body: email.body,
        },
        status: "PENDING",
      }));

      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "EMAIL",
          method: "send_multiple_emails",
          params: [
            {
              emails: emailPayload,
            },
          ],
        },
      });

      console.log("Correos enviados:", response);
    } catch (error) {
      console.error("Error enviando correos:", error);
    }
  };

  // Función para cargar archivos de datos
  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (file.type === "application/json") {
        try {
          const parsedData = JSON.parse(data as string);

          console.log("Datos JSON:", parsedData);
          if (Array.isArray(parsedData)) {
            setRecipientData(parsedData);
            setFileLoaded(true);
            setFileName(file.name);
            console.log("Datos cargados:", parsedData);
          } else {
            setResponseMessage("El archivo JSON no tiene el formato correcto.");
          }
        } catch (error) {
          setResponseMessage("Error al leer el archivo JSON.");
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
          const correo = row[0] as string;
          const variables = headers.slice(1).reduce((acc, header, index) => {
            acc[header] = row[index + 1];
            return acc;
          }, {} as Record<string, string | number>);
          return { correo, variables };
        });
        setRecipientData(formattedData);
        setFileLoaded(true);
        setFileName(file.name);
        console.log("Datos cargados:", formattedData);
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
  // Función para manejar adjuntos
  const handleAttachmentsUpload = (files: FileList) => {
    const newAttachments = Array.from(files);
    setAttachments((prev) => [...prev, ...newAttachments]);
    console.log(
      "Archivos adjuntos agregados:",
      newAttachments.map((file) => file.name)
    );
  };

  // Función para asignar archivos a destinatarios
  const assignFilesToRecipients = async (
    fileAssignments: Record<string, string[]> | "all"
  ) => {
    if (fileAssignments === "all") {
      // Caso 1: Enviar los mismos archivos a todos los destinatarios
      const updatedRecipientData = recipientData.map((recipient) => ({
        ...recipient,
        files: attachments.map((file) => file.name), // Asignar todos los archivos a cada destinatario
      }));
      setRecipientData(updatedRecipientData);
      console.log(
        "Archivos asignados a todos los destinatarios:",
        updatedRecipientData
      );
    } else {
      // Caso 2: Asignar archivos específicos según un archivo JSON
      const updatedRecipientData = recipientData.map((recipient) => ({
        ...recipient,
        files: fileAssignments[recipient.correo] || [], // Asignar archivos específicos según el JSON
      }));
      setRecipientData(updatedRecipientData);
      console.log(
        "Archivos asignados según configuración:",
        updatedRecipientData
      );
    }

    setShowAttachmentModal(false); // Cerrar el modal
  };

  const processFileAssignments = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (typeof data === "object" && data !== null) {
          assignFilesToRecipients(data);
        } else {
          setResponseMessage("El archivo JSON no tiene el formato correcto.");
        }
      } catch (error) {
        console.error("Error al procesar el archivo JSON:", error);
        setResponseMessage("Error al leer el archivo JSON.");
      }
    };

    reader.readAsText(file);
  };

  // Función para reemplazar variables en el contenido
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

  // Función para enviar correos
  const handleSendEmails = async () => {
    try {
      const emailsToSend: Array<{
        type: string;
        content: {
          to: string;
          subject: string;
          body: string;
          attachments?: Array<{ fileName: string }>;
        };
        status: string;
      }> = [];

      // Subir los archivos al servidor y obtener sus nombres
      const uploadedFiles = await Promise.all(
        attachments.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${file.name}`);
          }

          const data = await response.json();
          return { name: file.name }; // Solo necesitamos el nombre del archivo
        })
      );

      console.log("Archivos subidos:", uploadedFiles);

      // Verificar si el contenido tiene variables
      const hasVariables = content.includes("{{") && content.includes("}}");

      // Si hay variables, verificar que el archivo de datos esté cargado
      if (hasVariables && recipientData.length === 0) {
        throw new Error(
          "El contenido del correo contiene variables, pero no se ha cargado un archivo de datos."
        );
      }

      // Procesar correos
      if (recipientData.length > 0) {
        // Si hay datos de destinatarios, procesar cada uno
        for (const recipient of recipientData) {
          console.log("Destinatario:", recipient);

          // Reemplazar las variables en el contenido del correo si hay variables
          const personalizedContent = hasVariables
            ? replaceVariables(content, recipient.variables)
            : content;

          console.log("Contenido personalizado:", personalizedContent);

          // Manejar los archivos adjuntos
          let recipientAttachments: Array<{ fileName: string }> = [];

          if (useDataFileForAttachments) {
            // Asignar archivos específicos según el archivo de datos
            recipientAttachments = recipient.files
              ?.map((file: any) => {
                const matchedFile = uploadedFiles.find(
                  (uploadedFile) => uploadedFile.name === file.name
                );
                return matchedFile ? { fileName: matchedFile.name } : null;
              })
              .filter(Boolean) as Array<{ fileName: string }>;
          } else {
            // Enviar los mismos archivos a todos
            recipientAttachments = uploadedFiles.map((file) => ({
              fileName: file.name,
            }));
          }

          emailsToSend.push({
            type: "EMAIL",
            content: {
              to: recipient.correo,
              subject,
              body: personalizedContent, // Contenido con o sin variables reemplazadas
              attachments: recipientAttachments, // Archivos asignados
            },
            status: "PENDING",
          });
        }
      } else {
        // Si no hay datos de destinatarios, enviar el mismo correo a todos los correos en `stateEmails`
        if (stateEmails.length === 0) {
          throw new Error("No hay destinatarios para enviar el correo.");
        }

        for (const email of stateEmails) {
          if (email === "") continue;

          emailsToSend.push({
            type: "EMAIL",
            content: {
              to: email,
              subject,
              body: content, // Contenido sin variables porque no hay destinatarios específicos
              attachments: uploadedFiles.map((file) => ({
                fileName: file.name,
              })), // Enviar los mismos archivos a todos
            },
            status: "PENDING",
          });
        }
      }

      // Enviar todos los correos en una sola petición
      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "EMAIL",
          method: "send_multiple_emails",
          params: [
            {
              emails: emailsToSend,
            },
          ],
        },
      });

      console.log("Correos enviados:", response);

      // Mostrar el modal de éxito
      setShowSuccessModal(true);

      // Esperar 1.5 segundos para cerrar el modal y ejecutar la animación
      setTimeout(() => {
        setShowSuccessModal(false);

        // Iniciar la animación de envío
        setIsSending(true);
        setTimeout(() => {
          setIsSending(false);
          navigate("/emails"); // Redirigir después de la animación
        }, 2500); // Duración de la animación (2.5s)
      }, 1500); // Duración del modal (1.5s)
    } catch (error: any) {
      console.error("Error al enviar los correos:", error);
      setResponseMessage(error.message || "Error al enviar los correos.");
    }
  };

  return {
    editorType,
    setEditorType,
    content,
    setContent,
    variables,
    setVariables,
    responseMessage,
    setResponseMessage,
    subject,
    setSubject,
    isSending,
    setIsSending,
    fileLoaded,
    setFileLoaded,
    recipientData,
    setRecipientData,
    fileName,
    setFileName,
    attachments,
    setAttachments,
    showSuccessModal,
    setShowSuccessModal,
    showAttachmentModal,
    setShowAttachmentModal,
    handleFileUpload,
    handleAttachmentsUpload,
    assignFilesToRecipients,
    handleSendEmails,
    replaceVariables,
    processFileAssignments,
    useDataFileForAttachments,
    setUseDataFileForAttachments,
  };
};

export default useEmailSender;
