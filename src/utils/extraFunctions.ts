export const getStatusColor = (status: string) => {
  switch (status) {
    case "fallidos":
      return "bg-red-500 text-white";
    case "en proceso":
      return "bg-yellow-500 text-black";
    case "exitosos":
      return "bg-green-500 text-white";
    default:
      return "";
  }
};

export const filterDataEmails = (data: any) => {

  if (!Array.isArray(data)) {
    console.error("Expected an array, but got:", data);
    return [];
  }
  
  return data
    .filter((item: any) => item.estado === status)
    .map((item: any) => ({
      id: item.id,
      origen: item.origen,
      destino: item.destino,
      asunto: item.asunto,
      fecha: item.fecha,
      hora: item.hora,
    }));
};
