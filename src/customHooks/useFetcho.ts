import fetcho from "../utils/Fetcho";

const useFetcho = () => {
  const fetchWithLoading = async (params: any) => {
    try {
      // Obtener el token desde localStorage
      const token = localStorage.getItem("token");

      // Agregar el token al encabezado si existe
      const headers = {
        ...params.headers,
        ...(token ? { Authorization: `${token}` } : {}),
      };

      // Crear una promesa que se rechaza después de 10 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Operation timed out after 10 seconds"));
        }, 6000);
      });

      // Competir la promesa de fetcho con la promesa de tiempo de espera
      const data = await Promise.race([
        fetcho({ ...params, headers }), // Pasar los encabezados actualizados
        timeoutPromise,
      ]);

      return data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching, the url was ${params.url} and the error was ${error.message}`
      );
      return false;
    }
  };

  return fetchWithLoading;
};

export default useFetcho;