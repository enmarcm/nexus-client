import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Para recibir datos de navegación y redirigir
import Layout from "../components/Layout";
import TextEdit from "../components/Sends/TextEdit";
import HTMLSelect from "../components/Sends/Mail/HTMLSelect";
import ButtonSend from "../components/Sends/ButtonSend";
import useFetcho from "../customHooks/useFetcho";
import { API_URL } from "../data/constants"; // Asegúrate de importar la constante API_URL

const NewTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tipo, nombre } = location.state || { tipo: "email", nombre: "Nueva Plantilla" }; // Datos recibidos

  const [templateType] = useState<1 | 2>(tipo as 1 | 2);
  const [editorType, setEditorType] = useState<"html" | "text">("html");
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const fetchWithLoading = useFetcho();

  const handleSave = async () => {
    try {
      // Simula una llamada al backend para guardar la plantilla
      const co_template = {
        editorType: templateType === 1 ? editorType : "text",
        content,
        variables,
      };

      console.log("Guardando plantilla:", co_template);

      // Aquí puedes hacer una llamada al backend
      // Ejemplo:
      // await fetch("/api/templates", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(templateData),
      // });

        await fetchWithLoading({
          url: `${API_URL}/toProcess`,
          method: "POST",
          body: {
            object: "TEMPLATE",
            method: "create_template",
            params: {
              id_user: 2,
              de_template: nombre,
              co_template: co_template,
              id_type: Number.parseInt(templateType.toString()),
            },
          },
        })

      // Redirige al usuario de vuelta a la lista de plantillas
      navigate("/template", { state: { success: true } });
    } catch (error) {
      console.error("Error al guardar la plantilla:", error);
      alert("Hubo un error al guardar la plantilla. Inténtalo de nuevo.");
    }
  };

  return (
    <Layout title="Editor de Plantillas">
      <div
        className="w-full flex bg-gray-100 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* COLUMNA 1 */}
        <div className="w-8/12 h-full flex flex-col bg-white rounded-md shadow-lg p-6 gap-6">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-700">
              Editor de {templateType === 1 ? "Email" : "SMS"}
            </h1>
            {templateType === 1 && (
              <HTMLSelect editorType={editorType} setEditorType={setEditorType} />
            )}
          </div>

          <TextEdit
            editorType={templateType === 1 ? editorType : "text"}
            content={content}
            setContent={setContent}
            setVariables={setVariables}
          />

          <div className="w-full h-24">
            <ButtonSend label="Guardar Plantilla" onClick={handleSave} />
          </div>
        </div>

        {/* COLUMNA 2 */}
        <div className="w-4/12 h-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Información</h2>
            <p className="text-sm text-gray-600">
              <strong>Nombre:</strong> {nombre}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tipo:</strong> {templateType === 1 ? "Email" : "SMS"}
            </p>
          </div>

          <div className="w-full h-2/5 flex flex-col gap-4 p-6 bg-gray-50 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Previsualización</h2>
            <div className="w-full h-full border border-gray-300 rounded-md p-4 overflow-auto bg-gray-100">
              {templateType === 1 && editorType === "html" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="text-gray-700"
                ></div>
              ) : (
                <pre className="text-gray-700 whitespace-pre-wrap">{content}</pre>
              )}
            </div>
          </div>

          <div className="w-full h-2/5 flex flex-col gap-4 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Variables detectadas</h2>
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
        </div>
      </div>
    </Layout>
  );
};

export default NewTemplate;