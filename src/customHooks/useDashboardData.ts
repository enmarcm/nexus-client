import { useState, useEffect } from "react";
import useFetcho from "../customHooks/useFetcho";
import { API_URL } from "../data/constants";
import graphicsConfig from "../data/graphics.json";
import tableConfig from "../data/tables.json";

const useDashboardData = (sessionData: any) => {
  const fetchWithLoading = useFetcho();

  // Estados iniciales cargados desde localStorage o valores por defecto
  const [valuesGraphics, setValuesGraphics] = useState(() => {
    const cachedGraphics = localStorage.getItem("valuesGraphics");
    if (cachedGraphics) {
      return JSON.parse(cachedGraphics);
    } else {
      localStorage.setItem("valuesGraphics", JSON.stringify(graphicsConfig));
      return graphicsConfig;
    }
  });

  const [valueTables, setValueTables] = useState(() => {
    const cachedTables = localStorage.getItem("valueTables");
    if (cachedTables) {
      return JSON.parse(cachedTables);
    } else {
      localStorage.setItem("valueTables", JSON.stringify(tableConfig));
      return tableConfig;
    }
  });

  const [data, setData] = useState<any>(() => {
    const cachedData = localStorage.getItem("dashboardData");
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      localStorage.setItem("dashboardData", JSON.stringify(null));
      return null;
    }
  });

  const [dialogData, setDialogData] = useState<any>(null); // Datos para el diálogo
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado del diálogo

  const returnDataFetchReports = (method: string) => {
    return {
      url: `${API_URL}/toProcess`,
      method: "POST",
      body: {
        object: "REPORTS",
        method: method,
        params: [],
      },
      notLoading: true,
    };
  };

  const handleEmailPerDay = async () => {
    return await fetchWithLoading(returnDataFetchReports("get_emails_sent_by_day"));
  };

  const handleSMSPerDay = async () => {
    return await fetchWithLoading(returnDataFetchReports("get_sms_sent_by_day"));
  };

  const handleEmailTable = async () => {
    return await fetchWithLoading(returnDataFetchReports("obtain_email_sends"));
  };

  const handleSMSTable = async () => {
    return await fetchWithLoading(returnDataFetchReports("obtain_sms_sends"));
  };

  const handleUpdateTables = async () => {
    try {
      const dataEmail = (await handleEmailTable()) as any;
      const dataSMS = (await handleSMSTable()) as any;

      const dataMappedEmail = dataEmail.map((item: any) => ({
        ID: item.id,
        "CORREO ORIGEN": item.from ? item.from : "EN PROCESO",
        "CORREO DESTINO": item.content.to,
        ASUNTO: item.content.subject,
        "FECHA Y HORA": item.createdAt,
        ESTADO: item.status,
      }));

      const dataMappedSMS = dataSMS.map((item: any) => ({
        ID: item.id,
        "NUMERO DESTINO": item.content.to,
        "FECHA Y HORA": item.createdAt,
        ESTADO: item.status,
      }));

      const newObject = [
        { ...tableConfig[0], data: dataMappedEmail },
        { ...tableConfig[1], data: dataMappedSMS },
      ];

      setValueTables(newObject);
      localStorage.setItem("valueTables", JSON.stringify(newObject)); // Persistir en localStorage
    } catch (error) {
      console.error("Error updating tables:", error);
    }
  };

  const handleUpdateGraphics = async () => {
    try {
      const emailPerDay = await handleEmailPerDay();
      const smsPerDay = await handleSMSPerDay();

      const newObject = {
        firstHomeGraphic: [
          {
            ...graphicsConfig.firstHomeGraphic[0],
            configElements: {
              ...graphicsConfig.firstHomeGraphic[0].configElements,
              data: emailPerDay,
            },
          },
          {
            ...graphicsConfig.firstHomeGraphic[1],
            configElements: {
              ...graphicsConfig.firstHomeGraphic[1].configElements,
              data: smsPerDay,
            },
          },
        ],
        secondHomeGraphic: [
          {
            ...graphicsConfig.secondHomeGraphic[0],
            configElements: {
              ...graphicsConfig.secondHomeGraphic[0].configElements,
              data: [
                { value: 580, name: "Exitosos", color: "#2FE5A7" },
                { value: 484, name: "Fallidos", color: "#FF69B4" },
              ],
            },
          },
          {
            ...graphicsConfig.secondHomeGraphic[1],
            configElements: {
              ...graphicsConfig.secondHomeGraphic[1].configElements,
              data: [
                { value: 580, name: "Exitosos", color: "#2FE5A7" },
                { value: 484, name: "Fallidos", color: "#FF69B4" },
              ],
            },
          },
        ],
      };

      setValuesGraphics(newObject);
      localStorage.setItem("valuesGraphics", JSON.stringify(newObject)); // Persistir en localStorage
    } catch (error) {
      console.error("Error updating graphics:", error);
    }
  };

  const fetchData = async () => {
    try {
      const id_user = sessionData?.user?.id; // Obtén el id_user desde la sesión
      if (!id_user) {
        console.error("No se encontró el id_user en la sesión.");
        return;
      }
      const response = await fetchWithLoading({
        url: `${API_URL}/toProcess`,
        method: "POST",
        body: {
          object: "REPORTS",
          method: "get_data_for_cards_dashboard",
          params: {
            id_user,
          },
        },
        notLoading: true,
      });

      setData(response);
      localStorage.setItem("dashboardData", JSON.stringify(response)); // Persistir en localStorage
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCardClick = (type: string) => {
    if (!data) return;

    let dialogContent = [];
    switch (type) {
      case "EMAIL":
        dialogContent = data.EMAIL.map((item: any) => ({
          title: "Correo",
          value: item.name,
        }));
        break;
      case "SMS":
        dialogContent = data.SMS.map((item: any) => ({
          title: "Número",
          value: item.name,
        }));
        break;
      default:
        dialogContent = [];
    }

    setDialogData({ type, content: dialogContent });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!data) await fetchData();
      if (!valueTables.length) await handleUpdateTables();
      if (!valuesGraphics.firstHomeGraphic.length || !valuesGraphics.secondHomeGraphic.length) {
        await handleUpdateGraphics();
      }
    };

    loadInitialData();
  }, []);

  return {
    valuesGraphics,
    valueTables,
    data,
    dialogData,
    isDialogOpen,
    setIsDialogOpen,
    handleUpdateGraphics,
    handleUpdateTables,
    handleCardClick,
  };
};

export default useDashboardData;