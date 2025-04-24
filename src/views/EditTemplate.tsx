import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import TextEdit from "../components/Sends/TextEdit";
import HTMLSelect from "../components/Sends/Mail/HTMLSelect";
import ButtonSend from "../components/Sends/ButtonSend";
import { API_URL } from "../data/constants"; // Asegúrate de importar la constante API_URL
import useFetcho from "../customHooks/useFetcho"; // Asegúrate de que esta ruta sea correcta

const EditTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, nombre, tipo, content: initialContent } = location.state || {};
  console.log("initialContent", initialContent.content);
  const fetchWithLoading = useFetcho();

  const [templateName, setTemplateName] = useState(nombre || "Plantilla sin nombre");
  const [templateType] = useState<1 | 2>(tipo as 1 | 2);
  const [editorType, setEditorType] = useState<"html" | "text">(initialContent.editorType || "text");
  const [content, setContent] = useState(initialContent.content || "");
  const [variables, setVariables] = useState<string[]>([]);

  // Detecta variables dentro de {{}} en el contenido
  const extractVariables = (text: any) => {
    const regex = /{{(.*?)}}/g; // Busca todo lo que esté dentro de {{ }}
    console.log("Texto a analizar:", text);
    const matches = [...text.matchAll(regex)].map((match) => match[1].trim());
    return matches;
  };

  useEffect(() => {
    if (content) {
      const detectedVariables = extractVariables(content);
      setVariables(detectedVariables);
    }
  }, [content]); // Ejecuta cada vez que el contenido cambia

  const handleSave = async () => {
    try {
      const updatedTemplate = {
        de_template: templateName,
        co_template: {
          editorType: templateType === 1 ? editorType : "text",
          content,
          variables,
        },
        id_type: templateType === 1 ? 1 : 2,
        id_template: id,
      };

      console.log("Guardando cambios en la plantilla:", updatedTemplate);

     await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "TEMPLATE",
          method: "edit_template",
          params: updatedTemplate,
        },
      });

      // Simula una llamada al backend
      // await fetch(`/api/templates/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updatedTemplate),
      // });

      navigate("/template", { state: { success: true } });
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Hubo un error al guardar los cambios. Inténtalo de nuevo.");
    }
  };

  return (
    <Layout title="Editar Plantilla">
      <div
        className="w-full flex bg-gray-100 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* COLUMNA 1 */}
        <div className="w-8/12 h-full flex flex-col bg-white rounded-md shadow-lg p-6 gap-6">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-700">
              Editar {templateType === 1 ? "Email" : "SMS"}
            </h1>
            {templateType === 1 && (
              <HTMLSelect editorType={editorType} setEditorType={setEditorType} />
            )}
          </div>

          <TextEdit
            editorType={editorType}
            content={content}
            setContent={setContent}
            setVariables={setVariables}
          />

          <div className="w-full h-24">
            <ButtonSend label="Guardar Cambios" onClick={handleSave} />
          </div>
        </div>

        {/* COLUMNA 2 */}
        <div className="w-4/12 h-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Información</h2>
            <p className="text-sm text-gray-600">
              <strong>Nombre:</strong> {templateName}
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

export default EditTemplate;