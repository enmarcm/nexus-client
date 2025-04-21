import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Table from "../components/Table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import EditGroupModal from "../components/Modal/Group/EditGroupModal";
import NewGroupModal from "../components/Modal/Group/NewGroupModal";
import AddParticipantsModal from "../components/Modal/Group/AddParticipantsModal";
import ConfirmDeleteModal from "../components/Modal/Group/ConfirmDeleteModal";
import useFetcho from "../customHooks/useFetcho";
import { API_URL } from "../data/constants";

export enum GroupTypeOptions {
  EMAIL = "email",
  SMS = "sms",
}

const Groups = () => {
  const [filterType, setFilterType] = useState<GroupTypeOptions>(
    GroupTypeOptions.EMAIL
  );
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] =
    useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groupToDelete, setGroupToDelete] = useState<any>(null);
  const [newGroupData, setNewGroupData] = useState<{
    tipo: GroupTypeOptions;
    nombre: string;
  } | null>(null);

  const COLUMNS_TABLE = ["id", "nombre", "miembros", "tipo", "acciones"];

  const fetchWithLoading = useFetcho();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = (await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "obtain_all_group",
        },
      })) as any;

      const parsedData = response.map((item: any) => ({
        id: item.id_group,
        nombre: item.de_group,
        miembros: item.total_saved,
        tipo: item.de_type,
      }));

      setData(parsedData); // Establece los datos completos
      setFilteredData(
        parsedData.filter((item: any) => item.tipo === filterType)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Si hay un error, establece los datos como vacíos
      setFilteredData([]); // También establece los datos filtrados como vacíos
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  useEffect(() => {
    fetchData();
    if (data.length > 0) {
      setFilteredData(data.filter((item: any) => item.tipo === filterType));
    }
  }, [filterType]); // Actualiza los datos filtrados cuando cambia el filtro o los datos

  const handleEdit = (row: any) => {
    setSelectedGroup(row);
    setIsEditModalOpen(true);
  };

  const handleErase = (row: any) => {
    setGroupToDelete(row);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (groupToDelete) {

      console.log("Grupo a eliminar:", groupToDelete);
      try {
        await fetchWithLoading({
          url: `${API_URL}/toProcess`,
          method: "POST",
          body: {
            object: "GROUP",
            method: "delete_group",
            params: { id_group: groupToDelete.id },
          },
        });

        // Actualiza los datos locales después de la eliminación exitosa
        setData((prevData) =>
          prevData.filter((group) => group.id !== groupToDelete.id)
        );
        setFilteredData((prevData) =>
          prevData.filter((group) => group.id !== groupToDelete.id)
        );

        console.log("Grupo eliminado:", groupToDelete);
      } catch (error) {
        console.error("Error eliminando el grupo:", error);
      } finally {
        setGroupToDelete(null);
        setIsConfirmDeleteModalOpen(false);
      }
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
    setIsEditModalOpen(false);
    setSelectedGroup(null);
  };

  const handleNewGroupNext = (groupData: {
    tipo: GroupTypeOptions;
    nombre: string;
  }) => {
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
            onChange={(e) =>
              setFilterType(e.target.value as unknown as GroupTypeOptions)
            }
            className="border border-gray-300 rounded-md px-6 py-3 text-sm w-64 shadow-sm focus:ring-2 focus:ring-blue-300"
          >
            <option value={GroupTypeOptions.EMAIL}>Email</option>
            <option value={GroupTypeOptions.SMS}>SMS</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 capitalize">
            {filterType === GroupTypeOptions.EMAIL ? "Email" : "SMS"}
          </h3>
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
