import { useContext } from "react";
import fetcho from "../utils/Fetcho";
import LoaderContext from "../context/LoaderContext";

const useFetcho = () => {
  const { setLoading } = useContext(LoaderContext); // Obtener el método para controlar el estado de carga

  const fetchWithLoading = async (params: any) => {
    try {
      if(!params?.notLoading){
        setLoading(true); // Activar el loader globa
      }

      const token = localStorage.getItem("token");
      const headers = {
        ...params.headers,
        ...(token ? { Authorization: `${token}` } : {}),
      };

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Operation timed out after 10 seconds"));
        }, 30000);
      });

      const data = await Promise.race([
        fetcho({ ...params, headers }),
        timeoutPromise,
      ]);

      return data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching, the url was ${params.url} and the error was ${error.message}`
      );
      return false;
    } finally {
      setLoading(false); // Desactivar el loader global
    }
  };

  return fetchWithLoading;
};

export default useFetcho;