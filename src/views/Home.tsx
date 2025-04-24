import { FaFolder, FaPhoneAlt, FaWindowMaximize } from "react-icons/fa";
import CardNotification from "../components/CardNotification";
import ContainerGraphics from "../components/Graphics/ContainerGraphics";
import Layout from "../components/Layout";
import dataGraphics from "../data/graphics.json";
import { FaPeopleGroup } from "react-icons/fa6";
import configTables from "../data/tables.json";
import ContainerTables from "../components/ContainerTables";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetcho from "../customHooks/useFetcho";
import { API_URL } from "../data/constants";
import DialogCardsHome from "../components/DialogCardsHome";
import useSession from "../customHooks/useSession";

const Home = () => {
  const navigate = useNavigate();
  const fetchWithLoading = useFetcho();

  const { sessionData } = useSession();

  const [valuesGraphics, setValuesGraphics] = useState({
    firstGraphics: dataGraphics.firstHomeGraphic,
    secondGraphics: dataGraphics.secondHomeGraphic,
  });

  const [valueTables, setValueTables] = useState(configTables);
  const [data, setData] = useState<any>(null); // Datos de la API
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
    const data = await fetchWithLoading(
      returnDataFetchReports("get_emails_sent_by_day")
    );

    return data;
  };
  const handleSMSPerDay = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_sms_sent_by_day")
    );

    return data;
  };
  const handleEmailSuccess = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_email_success_and_failed")
    );

    return data;
  };
  const handleSMSSuccess = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_sms_success_and_failed")
    );

    return data;
  };

  // Ahora los de las tablas
  const handleEmailTable = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("obtain_email_sends")
    );

    return data;
  };

  const handleSMSTable = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("obtain_sms_sends")
    );

    return data;
  };

  const handleUpdateTables = async () => {
    const dataEmail = (await handleEmailTable()) as any;
    const dataSMS = (await handleSMSTable()) as any;

    const dataMappedEmail = dataEmail.map((item: any) => {
      const newObject = {
        ID: item.id,
        "CORREO ORIGEN": item.from ? item.from : "EN PROCESO",
        "CORREO DESTINO": item.content.to,
        ASUNTO: item.content.subject,
        "FECHA Y HORA": item.createdAt,
        ESTADO: item.status,
      };

      return newObject;
    });

    const dataMappedSMS = dataSMS.map((item: any) => {
      const newObject = {
        ID: item.id,
        "NUMERO DESTINO": item.content.to,
        "FECHA Y HORA": item.createdAt,
        ESTADO: item.status,
      };

      return newObject;
    });

    console.log(dataMappedEmail, dataMappedSMS);

    const newObject = [
      { ...configTables[0], data: dataMappedEmail },
      { ...configTables[1], data: dataMappedSMS },
    ];

    setValueTables(newObject as any);
  };

  const handleUpdateGraphics = async () => {
    const emailPerDay = await handleEmailPerDay();
    const smsPerDay = await handleSMSPerDay();
    const emailSuccess = await handleEmailSuccess();
    const smsSuccess = await handleSMSSuccess();

    const newObject = {
      firstGraphics: [
        {
          ...valuesGraphics.firstGraphics[0],
          configElements: {
            ...valuesGraphics.firstGraphics[0].configElements,
            data: emailPerDay,
          },
        },
        {
          ...valuesGraphics.firstGraphics[1],
          configElements: {
            ...valuesGraphics.firstGraphics[1].configElements,
            data: smsPerDay,
          },
        },
      ],
      secondGraphics: [
        {
          ...valuesGraphics.secondGraphics[0],
          configElements: {
            ...valuesGraphics.secondGraphics[0].configElements,
            data: emailSuccess,
          },
        },
        {
          ...valuesGraphics.secondGraphics[1],
          configElements: {
            ...valuesGraphics.secondGraphics[1].configElements,
            data: smsSuccess,
          },
        },
      ],
    };

    console.log(newObject);
    setValuesGraphics(newObject as any);
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
      });

      console.log(response);
      setData(response);
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
      case "TEMPLATES":
        dialogContent = data.TEMPLATES.map((item: any) => ({
          title: "Plantilla",
          value: `${item.name} (${item.type})`,
        }));
        break;
      case "GROUPS":
        dialogContent = data.GROUPS.map((item: any) => ({
          title: "Grupo",
          value: `${item.name} (${item.members} miembros)`,
        }));
        break;
      default:
        dialogContent = [];
    }

    setDialogData({ type, content: dialogContent });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    // Aquí vamos a obtener la información de los gráficos y tablas al cargar
    handleUpdateGraphics();
    handleUpdateTables();
    fetchData();
  }, []);

  return (
    <Layout title="Dashboard">
      <section className="flex flex-col w-full h-full gap-8 overflow-x-hidden">
        <div className="flex justify-between gap-16">
          <CardNotification
            icon={FaFolder}
            quantity={data?.EMAIL?.length || 0}
            color="#6B46C1"
            content="E-MAILS"
            handleClick={() => handleCardClick("EMAIL")}
          />
          <CardNotification
            icon={FaPhoneAlt}
            quantity={data?.SMS?.length || 0}
            color="#2FE5A7"
            content="TELEFONOS"
            handleClick={() => handleCardClick("SMS")}
          />
          <CardNotification
            icon={FaPeopleGroup}
            quantity={data?.GROUPS?.length || 0}
            color="#FF69B4"
            content="GRUPOS"
            handleClick={() => handleCardClick("GROUPS")}
          />
          <CardNotification
            icon={FaWindowMaximize}
            quantity={data?.TEMPLATES?.length || 0}
            color="#6254FF"
            content="PLANTILLAS"
            handleClick={() => handleCardClick("TEMPLATES")}
          />
        </div>

        <div className="flex h-80 gap-4 overflow-hidden">
          <div className="w-7/12 h-full min-h-full">
            <ContainerGraphics configGraphics={valuesGraphics.firstGraphics} />
          </div>

          <div className="w-5/12 h-full min-h-full">
            <ContainerGraphics configGraphics={valuesGraphics.secondGraphics} />
          </div>
        </div>

        <div className="w-full overflow-x-hidden">
          <ContainerTables configTables={valueTables} />
        </div>
      </section>

      {/* Diálogo */}
      {isDialogOpen && (
        <DialogCardsHome
          title={`Detalles de ${dialogData.type}`}
          content={dialogData.content}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </Layout>
  );
};

export default Home;