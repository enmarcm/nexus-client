import { useEffect } from "react";
import useDashboardData from "../customHooks/useDashboardData";
import useSession from "../customHooks/useSession";
import CardNotification from "../components/CardNotification";
import { FaFolder, FaPhoneAlt, FaWindowMaximize } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import ContainerGraphics from "../components/Graphics/ContainerGraphics";
import ContainerTables from "../components/ContainerTables";
import DialogCardsHome from "../components/DialogCardsHome";
import Layout from "../components/Layout";

const Home = () => {
  const { sessionData } = useSession();

  const {
    valuesGraphics,
    valueTables,
    data,
    dialogData,
    isDialogOpen,
    setIsDialogOpen,
    handleUpdateGraphics,
    handleUpdateTables,
    handleCardClick,
  } = useDashboardData(sessionData);

  useEffect(() => {
    handleUpdateGraphics();
    handleUpdateTables();
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
            <ContainerGraphics configGraphics={valuesGraphics.firstHomeGraphic} />
          </div>

          <div className="w-5/12 h-full min-h-full">
            <ContainerGraphics configGraphics={valuesGraphics.secondHomeGraphic} />
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