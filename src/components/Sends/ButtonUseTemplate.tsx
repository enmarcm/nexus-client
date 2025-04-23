import React, { useState, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa"; // Ícono para las plantillas
import useFetcho from "../../customHooks/useFetcho"; // Hook para manejar la carga de datos
import { API_URL } from "../../data/constants"; // Asegúrate de que esta ruta sea correcta

interface ButtonUseTemplateProps {
  type: "email" | "sms"; // Tipo de plantilla (Email o SMS)
  setContent: (content: string) => void; // Setter para actualizar el contenido del editor
}

const ButtonUseTemplate: React.FC<ButtonUseTemplateProps> = ({ type, setContent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [templates, setTemplates] = useState<{
    nombre: any; id: any; name: any; content: any 
}[]>([]); // Plantillas disponibles
  const [loading, setLoading] = useState(false); // Estado de carga
  const [previewContent, setPreviewContent] = useState<string | null>(null); // Contenido para previsualización

  const fetchWithLoading = useFetcho(); // Hook para manejar la carga de datos

  // Función para obtener las plantillas (pendiente de implementación)
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // Simulación de una llamada a la base de datos
      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`, // URL de la API
        method: "POST",
        body: {
          object: "TEMPLATE",
          method: "get_all_template",
          // Filtrar por tipo (Email o SMS)
        },
      }) as any;

      const dataParsed = response.templates.map((item: any) => {
        let parsedContent;
        
        try {
          parsedContent = JSON.parse(item.co_template); // Parsear el contenido de la plantilla
        } catch (error) {
          console.error("Error parsing template content:", error);
          parsedContent = item.co_template; // Si no se puede parsear, establecer como null
        }
         return {
          id: item.id_template,
          nombre: item.de_template,
          tipo: item.id_type, // Cambiar el tipo directamente a cualquier valor
          content: parsedContent,
        };
      });

      console.log("dataParsed", dataParsed);

      const fetchedTemplates = [
        { id: "1", name: "Plantilla 1", content: "Contenido de la plantilla 1", type: "email" },
        { id: "2", name: "Plantilla 2", content: "Contenido de la plantilla 2", type: "sms" },
        { id: "3", name: "Plantilla 3", content: "Contenido de la plantilla 3", type: "email" },
      ];
      // Filtrar plantillas según el tipo
      const filteredTemplates = dataParsed.filter((template: { tipo: number; }) => {
        const templateType = template.tipo == 1 ? 'email' : 'sms';
        console.log("tipo de template",templateType) // Map numeric type to string
        console.log("type", type);
        return templateType == type; // Compare string types
      });
      setTemplates(filteredTemplates);
      console.log("filteredTemplates", filteredTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir el modal y cargar las plantillas
  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchTemplates(); // Cargar las plantillas al abrir el modal
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreviewContent(null); // Limpiar la previsualización
  };

  // Seleccionar una plantilla y actualizar el contenido del editor
  const handleSelectTemplate = (content: string) => {
    setContent(content); // Actualizar el contenido del editor
    handleCloseModal(); // Cerrar el modal
  };

  return (
    <>
      <button
        className="bg-purple-500 text-white rounded-md px-8 py-3 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition w-full"
        onClick={handleOpenModal} // Abrir el modal al hacer clic
      >
        Usar Plantilla
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal} // Cerrar el modal al hacer clic fuera del contenido
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[40rem] h-[35rem] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del modal cierre el modal
          >
            <h2 className="text-xl font-semibold mb-4">Seleccionar Plantilla</h2>
            {loading ? (
              <p className="text-gray-500">Cargando plantillas...</p>
            ) : templates.length > 0 ? (
              <div className="flex gap-4 h-full">
                {/* Lista de plantillas */}
                <ul className="w-1/2 overflow-y-auto space-y-2 border-r border-gray-300 pr-4">
                  {templates.map((template) => (
                    <li
                      key={template.id}
                      className="flex items-center gap-2 p-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                      onMouseEnter={() => {
                        console.log("template", template.content?.content || template.content);
                        setPreviewContent(template.content.content || template.content); // Mostrar previsualización
                      }} // Mostrar previsualización
                      onMouseLeave={() => setPreviewContent(null)} // Limpiar previsualización
                      onClick={() => handleSelectTemplate(template.content.content || template.content)} // Seleccionar plantilla
                    >
                      <FaFileAlt className="text-gray-500" /> {/* Ícono */}
                      <span>{template.nombre}</span>
                    </li>
                  ))}
                </ul>

                {/* Previsualización */}
                <div className="w-1/2 p-4 bg-gray-50 rounded-md shadow-inner flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">Previsualización</h3>
                  <div className="flex-1 overflow-auto border border-gray-300 rounded p-2 bg-white">
                    {previewContent ? (
                      <pre className="text-gray-700 whitespace-pre-wrap">{previewContent}</pre>
                    ) : (
                      <p className="text-gray-500">Pasa el cursor sobre una plantilla para previsualizar su contenido.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hay plantillas disponibles.</p>
            )}
            <button
              className="mt-4 bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 self-end"
              onClick={handleCloseModal} // Cerrar el modal
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonUseTemplate;