import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Table from "../components/Table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import EditGroupModal from "../components/Modal/Group/EditGroupModal";
import NewGroupModal from "../components/Modal/Group/NewGroupModal";
import AddParticipantsModal from "../components/Modal/Group/AddParticipantsModal";
import ConfirmDeleteModal from "../components/Modal/Group/ConfirmDeleteModal";

export enum GroupTypeOptions {
  EMAIL = 1,
  SMS = 2,
}

const Groups = () => {
  const [filterType, setFilterType] = useState<GroupTypeOptions>(GroupTypeOptions.EMAIL); // Filtro inicial por tipo (Email)
  const [data, setData] = useState([
    {
      id: 1,
      nombre: "Grupo A",
      miembros: 10,
      fecha_creacion: "2025-04-01",
      tipo: GroupTypeOptions.EMAIL,
    },
    {
      id: 2,
      nombre: "Grupo B",
      miembros: 5,
      fecha_creacion: "2025-03-15",
      tipo: GroupTypeOptions.SMS,
    },
    {
      id: 3,
      nombre: "Grupo C",
      miembros: 8,
      fecha_creacion: "2025-02-20",
      tipo: GroupTypeOptions.EMAIL,
    },
  ]); // Datos iniciales

  const [filteredData, setFilteredData] = useState(data); // Datos filtrados
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para el modal de edición
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false); // Estado para el modal de nuevo grupo
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] = useState(false); // Estado para el modal de agregar participantes
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false); // Estado para el modal de confirmación de eliminación
  const [selectedGroup, setSelectedGroup] = useState<any>(null); // Grupo seleccionado para editar
  const [groupToDelete, setGroupToDelete] = useState<any>(null); // Grupo seleccionado para eliminar
  const [newGroupData, setNewGroupData] = useState<{
    tipo: GroupTypeOptions;
    nombre: string;
  } | null>(null); // Almacena los datos del nuevo grupo

  const COLUMNS_TABLE = ["id", "nombre", "miembros", "fecha_creacion", "tipo", "acciones"];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Filtra los datos por tipo (Email o SMS)
      const filtered = data.filter((item) => item.tipo === filterType);
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

  const handleEdit = (row: any) => {
    setSelectedGroup(row);
    setIsEditModalOpen(true);
  };

  const handleErase = (row: any) => {
    setGroupToDelete(row);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete) {
      setData((prevData) => prevData.filter((group) => group.id !== groupToDelete.id));
      setFilteredData((prevData) => prevData.filter((group) => group.id !== groupToDelete.id));
      console.log("Grupo eliminado:", groupToDelete);
      setGroupToDelete(null);
      setIsConfirmDeleteModalOpen(false);
    }
  };

  const handleSaveEdit = (updatedGroup: any) => {
    setData((prevData) =>
      prevData.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
    );
    setFilteredData((prevData) =>
      prevData.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
    );
    setIsEditModalOpen(false);
    setSelectedGroup(null);
  };

  const handleNewGroupNext = (groupData: { tipo: GroupTypeOptions; nombre: string }) => {
    setNewGroupData(groupData);
    setIsNewGroupModalOpen(false);
    setIsAddParticipantsModalOpen(true);
  };

  const handleCreateGroup = (participants: string[]) => {
    console.log("Grupo creado:", { ...newGroupData, participants });
    setIsAddParticipantsModalOpen(false);
  };

  return (
    <Layout title="Grupos">
      <section>
        <div className="flex gap-16 items-center w-full mb-8">
          <h2 className="font-semibold text-xl">FILTRAR POR</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as unknown as GroupTypeOptions)}
            className="border border-gray-300 rounded-md px-6 py-3 text-sm w-64 shadow-sm focus:ring-2 focus:ring-blue-300"
          >
            <option value={GroupTypeOptions.EMAIL}>Email</option>
            <option value={GroupTypeOptions.SMS}>SMS</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 capitalize">{filterType}</h3>
          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : filteredData.length > 0 ? (
            <Table
              columns={COLUMNS_TABLE}
              data={filteredData.map((item) => ({
                ...item,
                acciones: (
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleErase(item)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ),
              }))}
            />
          ) : (
            <p className="text-gray-500">No hay datos disponibles.</p>
          )}
        </div>
      </section>

      <button
        className={`fixed bottom-8 right-8 bg-[#FF69B4] text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg  transition-all duration-300 ${
          isEditModalOpen ? "scale-90" : "hover:scale-105"
        }`}
        onClick={() => setIsNewGroupModalOpen(true)}
      >
        <FaPlus />
        Nuevo Grupo
      </button>

      {isEditModalOpen && selectedGroup && (
        <EditGroupModal
          group={selectedGroup}
          onSave={handleSaveEdit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedGroup(null);
          }}
        />
      )}

      {isNewGroupModalOpen && (
        <NewGroupModal
          onClose={() => setIsNewGroupModalOpen(false)}
          onNext={handleNewGroupNext}
        />
      )}

      {isAddParticipantsModalOpen && newGroupData && (
        <AddParticipantsModal
          tipo={newGroupData.tipo}
          nombre={newGroupData.nombre}
          onClose={() => setIsAddParticipantsModalOpen(false)}
          onBack={() => {
            setIsAddParticipantsModalOpen(false);
            setIsNewGroupModalOpen(true);
          }}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {isConfirmDeleteModalOpen && groupToDelete && (
        <ConfirmDeleteModal
          groupName={groupToDelete.nombre}
          onConfirm={confirmDeleteGroup}
          onCancel={() => setIsConfirmDeleteModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default Groups;