import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Table from "../components/Table";
import { API_URL } from "../data/constants";
import { FaPlus } from "react-icons/fa";
import StatusSelector from "../components/StatusSelector";
import { filterDataGroups } from "../utils/extraFunctions";
import EditGroupModal from "../components/Modal/Group/EditGroupModal";
import NewGroupModal from "../components/Modal/Group/NewGroupModal"; // Importa el nuevo modal
import AddParticipantsModal from "../components/Modal/Group/AddParticipantsModal"; // Importa el modal para agregar participantes
import ConfirmDeleteModal from "../components/Modal/Group/ConfirmDeleteModal";

const Groups = () => {
  const [status, setStatus] = useState("exitosos");
  const [data, setData] = useState([
    {
      id: 1,
      nombre: "Grupo A",
      miembros: 10,
      fecha_creacion: "2025-04-01",
      estado: "exitosos",
    },
    {
      id: 2,
      nombre: "Grupo B",
      miembros: 5,
      fecha_creacion: "2025-03-15",
      estado: "fallidos",
    },
    {
      id: 3,
      nombre: "Grupo C",
      miembros: 8,
      fecha_creacion: "2025-02-20",
      estado: "proceso",
    },
  ]); // Datos iniciales

  const [filteredData, setFilteredData] = useState(data); // Datos filtrados
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false); // Estado para el modal de nuevo grupo
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] =
    useState(false); // Estado para el modal de agregar participantes
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false); // Estado para el modal de confirmación de eliminación
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groupToDelete, setGroupToDelete] = useState<any>(null); // Grupo seleccionado para eliminar
  const [newGroupData, setNewGroupData] = useState<{
    tipo: string;
    nombre: string;
  } | null>(null); // Almacena los datos del nuevo grupo

  const COLUMNS_TABLE = [
    "id",
    "nombre",
    "miembros",
    "fecha_creacion",
    "estado",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulación de llamada a la API
      const response = data; // Aquí iría la llamada real a la API
      const filtered = filterDataGroups(response, status);
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
  }, [status]); // Actualiza los datos filtrados cada vez que cambia el estado

  const handleEdit = (row: any) => {
    setSelectedGroup(row);
    setIsModalOpen(true);
  };

  const handleErase = (row: any) => {
    setGroupToDelete(row);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete) {
      setData((prevData) =>
        prevData.filter((group) => group.id !== groupToDelete.id)
      );
      setFilteredData((prevData) =>
        prevData.filter((group) => group.id !== groupToDelete.id)
      );
      console.log("Grupo eliminado:", groupToDelete);
      setGroupToDelete(null);
      setIsConfirmDeleteModalOpen(false);
    }
  };

  const handleSaveEdit = (updatedGroup: any) => {
    setData((prevData) =>
      prevData.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    setFilteredData((prevData) =>
      prevData.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handleNewGroupNext = (groupData: { tipo: string; nombre: string }) => {
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
          <StatusSelector status={status} setStatus={setStatus} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 capitalize">{status}</h3>
          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : filteredData.length > 0 ? (
            <Table
              columns={COLUMNS_TABLE}
              data={filteredData}
              editable
              erasable
              onEdit={handleEdit}
              onErase={handleErase}
              modalComponent={
                selectedGroup && (
                  <EditGroupModal
                    group={selectedGroup}
                    onSave={handleSaveEdit}
                    onCancel={() => {
                      setIsModalOpen(false);
                      setSelectedGroup(null);
                    }}
                  />
                )
              }
            />
          ) : (
            <p className="text-gray-500">No hay datos disponibles.</p>
          )}
        </div>
      </section>

      <button
        className={`fixed bottom-8 right-8 bg-[#FF69B4] text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg  transition-all duration-300 ${
          isModalOpen ? "scale-90" : "hover:scale-105"
        }`}
        onClick={() => setIsNewGroupModalOpen(true)}
      >
        <FaPlus />
        Nuevo Grupo
      </button>

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