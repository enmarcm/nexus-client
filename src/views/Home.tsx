import { FaFolder, FaPhoneAlt, FaWindowMaximize } from "react-icons/fa";
import CardNotification from "../components/CardNotification";
import ContainerGraphics from "../components/Graphics/ContainerGraphics";
import Layout from "../components/Layout";
import dataGraphics from "../data/graphics.json";
import { FaPeopleGroup } from "react-icons/fa6";
import configTables from "../data/tables.json"
import ContainerTables from "../components/ContainerTables";
import { useNavigate } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    console.log("Clickki");
    setTimeout(() => {
      setTimeout(() => {
        navigate("/email");
      }, 1000);
    }, 300);
  }

  return (
    <Layout title={"Home"}>
      <section className="flex flex-col w-full h-full gap-8 overflow-x-hidden">
        <div className="flex justify-between gap-16">
          <CardNotification
            icon={FaFolder}
            quantity={5}
            color="#6B46C1"
            content="E-MAILS"
            handleClick={() => handleButtonClick()}
          />
          <CardNotification
            icon={FaPhoneAlt}
            quantity={2}
            color="#2FE5A7"
            content="TELEFONOS"
            handleClick={() => console.log("Click")}
          />
          <CardNotification
            icon={FaPeopleGroup}
            quantity={6}
            color="#FF69B4"
            content="GRUPOS"
            handleClick={() => console.log("Click")}
          />
          <CardNotification
            icon={FaWindowMaximize}
            quantity={34}
            color="#6254FF"
            content="PLANTILLAS"
            handleClick={() => console.log("Click")}
          />
        </div>

        <div className="flex h-80 gap-4 overflow-hidden">
          <div className="w-7/12 h-full min-h-full">
            <ContainerGraphics configGraphics={dataGraphics.firstHomeGraphic} />
          </div>

          <div className="w-5/12 h-full min-h-full">
            <ContainerGraphics
              configGraphics={dataGraphics.secondHomeGraphic}
            />
          </div>


        </div>

        <div className="w-full overflow-x-hidden">
          <ContainerTables configTables={configTables}/>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
