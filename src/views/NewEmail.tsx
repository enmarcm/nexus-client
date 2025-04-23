import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadFiles from "../components/Sends/LoadFiles";
import UploadAttachmentsChange from "../components/UploadAttachmentsChange";
import ButtonSend from "../components/Sends/ButtonSend";
import ButtonUseTemplate from "../components/Sends/ButtonUseTemplate";
import HTMLSelect from "../components/Sends/Mail/HTMLSelect";
import TextEdit from "../components/Sends/TextEdit";
import { useEmailDataGlobal } from "../context/EmailDataGlobal";
import useEmailSender from "../customHooks/useEmailSender";
import "./css/NewEmail.css";
import ModalOptionsFiles from "../components/Modal/Mail/ModalOptionsFile";

const NewEmail = () => {
  const { state } = useEmailDataGlobal(); // Obtener datos del contexto global
  const navigate = useNavigate();

  const {
    editorType,
    setEditorType,
    content,
    setContent,
    variables,
    setVariables,
    responseMessage,
    subject,
    setSubject,
    isSending,
    fileLoaded,
    setFileLoaded,
    recipientData,
    setRecipientData,
    fileName,
    setFileName,
    attachments,
    handleFileUpload,
    handleAttachmentsUpload,
    handleSendEmails,
    showSuccessModal,
    showAttachmentModal,
    setShowAttachmentModal, // Incluye esto
    assignFilesToRecipients,
    processFileAssignments,
    setUseDataFileForAttachments,
  } = useEmailSender(state.emails, navigate);

  return (
    <Layout title="Correos">
      <div
        className={`w-full flex bg-gray-100 gap-4 overflow-hidden ${
          isSending ? "transition-style-out-circle-hesitate" : ""
        }`}
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* COLUMNA 1 */}
        <div className="w-8/12 h-full flex flex-col bg-white rounded-md shadow-lg p-4 gap-4">
          {/* Encabezado */}
          <div className="w-full flex items-center justify-between">
            <div className="w-9/12">
              <ButtonUseTemplate type="email" setContent={setContent} />
            </div>
            <div className="w-3/12 flex items-center justify-end">
              <HTMLSelect
                editorType={editorType}
                setEditorType={setEditorType}
              />
            </div>
          </div>

          {/* Input para el asunto */}
          <div className="w-full">
            <label
              htmlFor="subject"
              className="block text-gray-700 font-semibold mb-1"
            >
              Asunto:
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Escribe el asunto aquí"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Editor de texto */}
          <TextEdit
            editorType={editorType}
            content={content}
            setContent={setContent}
            setVariables={setVariables}
          />

          {/* Subir archivos y botón enviar */}
          <div className="w-full flex items-center gap-4 h-20">
            <div className="w-8/12 h-full">
              <UploadAttachmentsChange
                onFileUpload={(files) =>{
                  setShowAttachmentModal(true);
                  handleAttachmentsUpload(files)}
                } 
              />
            </div>
            <div className="w-4/12 h-full">
              <ButtonSend onClick={handleSendEmails} />
            </div>
          </div>
        </div>

        {/* COLUMNA 2 */}
        <div className="w-4/12 h-full flex flex-col gap-2">
          {/* Previsualización */}
          <div className="w-full h-2/5 flex flex-col gap-2 p-4 bg-white rounded-md shadow-md">
            <h1 className="text-lg font-bold text-gray-700">
              Previsualización
            </h1>
            <div className="w-full h-full border border-gray-300 rounded-md p-2 overflow-auto bg-gray-50">
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="text-gray-700 text-sm"
              ></div>
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
                  <li key={index}>{variable}</li>
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

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <h2 className="text-lg font-semibold text-green-500 mb-4">
              ¡Correos enviados a la cola!
            </h2>
            <p className="text-gray-700 text-sm">
              Los correos han sido enviados a la cola y están siendo procesados.
            </p>
          </div>
        </div>
      )}

      {/* Modal para asignar archivos */}
      {showAttachmentModal && (
       <ModalOptionsFiles
       onAssignToAll={() => {
        assignFilesToRecipients("all")
        setUseDataFileForAttachments(false); // Desactivar el uso del archivo de datos
       }} // Enviar los mismos archivos a todos
       onUseDataFile={() => {
         setUseDataFileForAttachments(true); // Activar el uso del archivo de datos
         setShowAttachmentModal(false);
       }}
       onClose={() => setShowAttachmentModal(false)}
       isDataFileLoaded={fileLoaded}
     />
      )}
    </Layout>
  );
};

export default NewEmail;
