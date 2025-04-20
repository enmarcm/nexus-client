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
import { url } from "inspector";
import { API_URL } from "../data/constants";

const Home = () => {
  const navigate = useNavigate();
  const fetchWithLoading = useFetcho();

  const [valuesGraphics, setValuesGraphics] = useState({
    // emailDay: dataGraphics.firstHomeGraphic[0],
    // smsDay: dataGraphics.firstHomeGraphic[1],
    // emailSuccess: dataGraphics.secondHomeGraphic[0],
    // smsSuccess: dataGraphics.secondHomeGraphic[1],


    firstGraphics: dataGraphics.firstHomeGraphic,
    secondGraphics: dataGraphics.secondHomeGraphic,
  });

  const handleButtonClick = () => {
    console.log("Clickki");
    setTimeout(() => {
      setTimeout(() => {
        navigate("/email");
      }, 1000);
    }, 300);
  };

  const returnDataFetchReports = (method: string) => {
    return {
      url: `${API_URL}/toProcess`,
      method: "POST",
      body: {
        object: "REPORTS",
        method: method,
        params: [],
      },
    };
  };

  const handleEmailPerDay = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_emails_sent_by_day")
    );

    return data
  };
  const handleSMSPerDay = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_sms_sent_by_day")
    );

    return data
  };
  const handleEmailSuccess = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_email_success_and_failed")
    );

    return data
  };
  const handleSMSSuccess = async () => {
    const data = await fetchWithLoading(
      returnDataFetchReports("get_sms_success_and_failed")
    );

    return data
  };

  const handleUpdateGraphics = async () =>{
    const emailPerDay = await handleEmailPerDay();
    const smsPerDay = await handleSMSPerDay();
    const emailSuccess = await handleEmailSuccess();
    const smsSuccess = await handleSMSSuccess();

    const newObject = {
      firstGraphics: [
        { ...valuesGraphics.firstGraphics[0], configElements: { ...valuesGraphics.firstGraphics[0].configElements, data: emailPerDay } },
        { ...valuesGraphics.firstGraphics[1], configElements: { ...valuesGraphics.firstGraphics[1].configElements, data: smsPerDay } },
      ],
      secondGraphics: [
        { ...valuesGraphics.secondGraphics[0], configElements: { ...valuesGraphics.secondGraphics[0].configElements, data: emailSuccess } },
        { ...valuesGraphics.secondGraphics[1], configElements: { ...valuesGraphics.secondGraphics[1].configElements, data: smsSuccess } },
      ],
    };

    console.log(newObject)
    setValuesGraphics(newObject as any);
  }

  useEffect(() => {
    //Aqui vamos a obtener la informacion de los graficos apenas empecemos
    handleUpdateGraphics();
  }, []);

  return (
    <Layout title="Dashboard">
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
            <ContainerGraphics configGraphics={valuesGraphics.firstGraphics} />
          </div>

          <div className="w-5/12 h-full min-h-full">
            <ContainerGraphics
              configGraphics={valuesGraphics.secondGraphics}
            />
          </div>
        </div>

        <div className="w-full overflow-x-hidden">
          <ContainerTables configTables={configTables} />
        </div>
      </section>
    </Layout>
  );
};

export default Home;
