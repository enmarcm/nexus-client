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

export const filterDataEmails = (data: any, status: string) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }

  return data
    .filter((item: any) => item.estado === status) // Filtra por estado
    .map((item: any) => ({
      id: item.id,
      origen: item.origen,
      destino: item.destino,
      asunto: item.asunto,
      fecha: item.fecha,
      hora: item.hora,
    }));
};

export const filterDataSms = (data: any, status: string) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }

  return data
    .filter((item: any) => item.estado === status) // Filtra por estado
    .map((item: any) => ({
      id: item.id,
      origen: item.origen,
      destino: item.destino,
      mensaje: item.mensaje, // Cambiado a "mensaje" para SMS
      fecha: item.fecha,
      hora: item.hora,
    }));
};

export const filterDataGroups = (data: any, status: string) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }

  return data
    .filter((item: any) => item.estado === status) // Filtra por estado
    .map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      miembros: item.miembros,
      fecha_creacion: item.fecha_creacion,
      estado: item.estado,
    }));
};