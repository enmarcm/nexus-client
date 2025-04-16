import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Table from "../components/Table"; // Asegúrate de que la ruta sea correcta
import useFetcho from "../customHooks/useFetcho";
import { API_URL } from "../data/constants";
import { filterDataSms, getStatusColor } from "../utils/extraFunctions"; // Cambiado para SMS
import { FaPlus } from "react-icons/fa"; // Importamos el ícono de "más"
import ModalSms from "../components/ModalSms"; // Cambiado para SMS

const Sms = () => {
  const [status, setStatus] = useState("fallidos");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [isClicked, setIsClicked] = useState(false); // Estado para manejar el efecto de clic

  const COLUMNS_TABLE = ["id", "origen", "destino", "mensaje", "fecha", "hora"]; // Cambiado para SMS

  const REQUEST_BODY = {
    url: `${API_URL}/toProcess`,
    method: "POST",
    body: {
      object: "sms", // Cambiado para SMS
      method: "getmessages", // Cambiado para SMS
    },
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchWithLoading = useFetcho();
      const params = REQUEST_BODY;
      const response = (await fetchWithLoading(params)) as any;
      const filteredData = filterDataSms(response, status) as any; // Cambiado para SMS
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleButtonClick = () => {
    setIsClicked(true); // Activa el efecto de clic
    setTimeout(() => {
      setIsClicked(false); // Desactiva el efecto después de un breve tiempo
      setIsModalOpen(true); // Abre el modal
    }, 200); // Tiempo del efecto
  };

  return (
    <Layout title="Mensajes de Texto">
      <section>
        {/* Parte de filtrar */}
        <div className="flex gap-16 items-center w-full mb-8">
          <h2 className="font-semibold text-xl">FILTRAR POR</h2>
          <select
            className={`p-2 rounded w-48 bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 ease-in-out ${getStatusColor(
              status
            )}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="fallidos" className="text-black bg-white">
              Fallidos
            </option>
            <option value="en proceso" className="text-black bg-white">
              En Proceso
            </option>
            <option value="exitosos" className="text-black bg-white">
              Exitosos
            </option>
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 capitalize">{status}</h3>
          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : data.length > 0 ? (
            <Table columns={COLUMNS_TABLE} data={data} />
          ) : (
            <p className="text-gray-500">No hay datos disponibles.</p>
          )}
        </div>
      </section>

      {/* Botón Sticky */}
      <button
        className={`fixed bottom-8 right-8 bg-pink-500 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 ${
          isClicked ? "scale-90" : "hover:scale-105"
        }`}
        style={{ backgroundColor: "#FF69B4" }}
        onClick={handleButtonClick} // Maneja el clic
      >
        <FaPlus />
        Nuevo Mensaje
      </button>

      {/* Modal */}
      {isModalOpen && <ModalSms onClose={() => setIsModalOpen(false)} />} {/* Cambiado para SMS */}
    </Layout>
  );
};

export default Sms;