export const getStatusColor = (status: string) => {
  switch (status) {
    case "fallidos":
      return "bg-red-700 text-white";
    case "en proceso":
      return "bg-yellow-500 text-black";
    case "exitosos":
      return "bg-green-600 text-white";
    default:
      return "";
  }
};

export const mapStatus = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "exitosos";
    case "ERROR":
      return "fallidos";
    case "PROCESSING":
      return "proceso";
    default:
      return "desconocido";
  }
};

export const filterDataEmails = (data: any, status: string) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }

  return data
    .filter((item: any) => status === "todos" || mapStatus(item.status) === status) 
    .map((item: any) => {

      const newObject = {
        id: item.id,
        origen: item.from ? item.from : "EN PROCESO",
        destino: item.content.to,
        asunto: item.content.subject,
        estado: mapStatus(item.status),
        "fecha y hora": item.createdAt,
      };

      return newObject;
    });
};

export const filterDataSms = (data: any, status: string) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }

  return data
    .filter((item: any) => status === "todos" || mapStatus(item.status) === status) // Maneja "todos"
    .map((item: any) => ({
      id: item.id,
      origen: item.from ? item.from : "EN PROCESO",
      destino: item.content.to,
      mensaje: item.content.body, // Cambiado a "mensaje" para SMS
      estado: mapStatus(item.status),
      "fecha y hora": item.createdAt,
    }));
};

export const filterDataGroups = (data: any, status: string) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }

  return data
    .filter((item: any) => mapStatus(item.estado) === status) // Filtra por estado mapeado
    .map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      miembros: item.miembros,
      fecha_creacion: item.fecha_creacion,
      estado: item.estado,
    }));
};
