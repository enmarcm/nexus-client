import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import Table from "../components/Table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import NewTemplateModal from "../components/Modal/Templates/NewTemplateModal";
import ConfirmEditModal from "../components/Modal/Templates/ConfirmEditModal";
import ConfirmDeleteModal from "../components/Modal/Templates/ConfirmDeleteModal"; // Importa el modal de confirmación de eliminación
import { useNavigate } from "react-router-dom";

export enum StatusOptions {
  EMAIL = 1,
  SMS = 2,
}

const Templates = () => {
  const [filterType, setFilterType] = useState<StatusOptions>(StatusOptions.EMAIL); // Filtro inicial por tipo (Email)
  const [data, setData] = useState([
    {
      id: 1,
      nombre: "Plantilla A",
      tipo: StatusOptions.EMAIL,
      fecha_creacion: "2025-04-01",
      content: "<h1>Telefono</h1>\n<p>Hola</p>\n{{VARIABLE1}}",
      variables: ["VARIABLE1"],

    },
    {
      id: 2,
      nombre: "Plantilla B",
      tipo: StatusOptions.SMS,
      fecha_creacion: "2025-03-15",
    },
  ]); // Datos iniciales

  const [filteredData, setFilteredData] = useState(data); // Datos filtrados
  const [loading, setLoading] = useState(false);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false); // Estado para el modal de nueva plantilla
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false); // Estado para el modal de confirmación de edición
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false); // Estado para el modal de confirmación de eliminación
  const [templateToEdit, setTemplateToEdit] = useState<any>(null); // Plantilla seleccionada para editar
  const [templateToDelete, setTemplateToDelete] = useState<any>(null); // Plantilla seleccionada para eliminar
  const navigate = useNavigate(); // Hook para redirigir

  const COLUMNS_TABLE = ["id", "nombre", "tipo", "fecha_creacion", "acciones"];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Filtra los datos por tipo (Email o SMS)
      const filtered = data.filter((item) => item.tipo == filterType);
      setFilteredData(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType]); // Actualiza los datos filtrados cada vez que cambia el filtro

  const handleNewTemplateNext = (templateData: { tipo: StatusOptions; nombre: string }) => {
    console.log("Datos de la nueva plantilla:", templateData);

    // Redirige a la página de edición de plantillas con los datos de la nueva plantilla
    navigate("/template/newTemplate", { state: templateData });
  };

  const handleEdit = (template: any) => {
    setTemplateToEdit(template);
    setIsConfirmEditModalOpen(true); // Abre el modal de confirmación
  };

  const confirmEdit = () => {
    setIsConfirmEditModalOpen(false);
    navigate("/template/editTemplate", { state: templateToEdit }); // Redirige a la página de edición
  };

  const handleDelete = (template: any) => {
    setTemplateToDelete(template);
    setIsConfirmDeleteModalOpen(true); // Abre el modal de confirmación de eliminación
  };

  const confirmDelete = () => {
    setData((prevData) => prevData.filter((item) => item.id !== templateToDelete.id));
    setFilteredData((prevData) => prevData.filter((item) => item.id !== templateToDelete.id));
    setIsConfirmDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  const renderActions = (template: any) => (
    <div className="flex gap-2">
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => handleEdit(template)}
      >
        <FaEdit />
      </button>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDelete(template)}
      >
        <FaTrash />
      </button>
    </div>
  );

  return (
    <Layout title="Plantillas">
      <section>
        <div className="flex gap-16 items-center w-full mb-8">
          <h2 className="font-semibold text-xl">FILTRAR POR</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as unknown as StatusOptions)}
            className="border border-gray-300 rounded-md px-6 py-3 text-sm w-64 shadow-sm focus:ring-2 focus:ring-blue-300"
          >
            <option value={StatusOptions.EMAIL}>Email</option>
            <option value={StatusOptions.SMS}>SMS</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 capitalize">{filterType == 1 ? "Email" : "SMS"}</h3>
          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : filteredData.length > 0 ? (
            <Table
              columns={COLUMNS_TABLE}
              data={filteredData.map((item) => ({
                ...item,
                tipo: item.tipo === StatusOptions.EMAIL ? "Email" : "SMS",
                acciones: renderActions(item),
              }))}
            />
          ) : (
            <p className="text-gray-500">No hay datos disponibles.</p>
          )}
        </div>
      </section>

      <button
        className="fixed bottom-8 right-8 bg-[#FF69B4] text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300"
        onClick={() => setIsNewTemplateModalOpen(true)} // Abre el modal de nueva plantilla
      >
        <FaPlus />
        Nueva Plantilla
      </button>

      {isNewTemplateModalOpen && (
        <NewTemplateModal
          onClose={() => setIsNewTemplateModalOpen(false)}
          onNext={handleNewTemplateNext}
        />
      )}

      {isConfirmEditModalOpen && templateToEdit && (
        <ConfirmEditModal
          templateName={templateToEdit.nombre}
          onConfirm={confirmEdit}
          onCancel={() => setIsConfirmEditModalOpen(false)}
        />
      )}

      {isConfirmDeleteModalOpen && templateToDelete && (
        <ConfirmDeleteModal
          templateName={templateToDelete.nombre}
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmDeleteModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default Templates;