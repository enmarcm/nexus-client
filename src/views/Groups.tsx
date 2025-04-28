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
  EMAIL = 1,
  SMS = 2,
}

const Groups = () => {
  const [filterType, setFilterType] = useState<GroupTypeOptions>(
    GroupTypeOptions.EMAIL
  );
  const [isEditMode, setIsEditMode] = useState(false); // Estado para el modo del modal

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
    members?: any[];
    id?: number;
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
        tipo: item.de_type === "email" ? GroupTypeOptions.EMAIL : GroupTypeOptions.SMS,
      }));
      console.log("Datos obtenidos:", parsedData);
      setData(parsedData); // Establece los datos completos
      console.log("tipo de filtrado:", filterType);
      setFilteredData(
        parsedData.filter((item: any) => item.tipo == filterType)
      );
      console.log("Datos filtrados:", filteredData);;
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

  const handleEdit = async (row: any) => {
    console.log("Grupo a editar:", row);
    try{
      const membersResponse = (await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "obtain_member_group",
          params: {
            id_group: row.id,
          },
        },
      })) as any;
      console.log("miembros:", membersResponse);
      const obj = {
        ...row,
        members: membersResponse.map((member: any) => member),
      }
      console.log("obj:", obj);
      setSelectedGroup(obj);
      setIsEditModalOpen(true);
    }catch(error){
      console.error("Error al obtener los miembros del grupo:", error);
    }
  };

  const handleRemoveMember = (id: number) => {
    setNewGroupData((prev) => {
      if (!prev) return prev; // Si `prev` es null, no hacer nada
  
      return {
        ...prev,
        members: prev.members?.filter((member) => member.id !== id) || [], // Filtrar los miembros
      };
    });
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

  const handleSaveEdit = async (updatedGroup: any) => {
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

    console.log("Grupo editado:", updatedGroup);
    try {
      await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "GROUP",
          method: "edit_group",
          params: {
            de_group: updatedGroup.nombre,
            id_group: updatedGroup.id,
          },
        },
      });
    } catch (error) {
      console.error("Error al editar el grupo:", error);
    }


    setIsEditModalOpen(false);
    setSelectedGroup(null);
  };

  const handleEditMembers = (
    groupData: { tipo: GroupTypeOptions; nombre: string; members: any[]; groupId: number; }
  ) => {
    setNewGroupData(groupData);
    console.log("Grupo a editar miembros:", groupData);
    setIsEditMode(true); // Establecer en modo edición
    setIsAddParticipantsModalOpen(true);
  };

  const handleNewGroupNext = (groupData: {
    tipo: GroupTypeOptions;
    nombre: string;
  }) => {
    setNewGroupData(groupData);
    setIsEditMode(false); // Establecer en modo creación
    setIsNewGroupModalOpen(false);
    setIsAddParticipantsModalOpen(true);
  };

  const handleCreateGroup = () => {
    setIsAddParticipantsModalOpen(false);
    fetchData();
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
                tipo: item.tipo === GroupTypeOptions.EMAIL ? "Email" : "SMS",
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
          onEditMembers={handleEditMembers}
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
        members={newGroupData.members || []}
        isEditMode={isEditMode}
        tipo={newGroupData.tipo}
        idGroup={newGroupData.id}
        nombre={newGroupData.nombre}
        onClose={() => setIsAddParticipantsModalOpen(false)}
        onBack={() => {
          setIsAddParticipantsModalOpen(false);
          setIsNewGroupModalOpen(true);
        }}
        onCreateGroup={handleCreateGroup}
        onRemoveMember={handleRemoveMember} // Pasar la función al modal
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
