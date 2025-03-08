import CardNotification from "../components/CardNotification";
import ContainerGraphics from "../components/Graphics/ContainerGraphics";
import Layout from "../components/Layout";
import dataGraphics from "../data/graphics.json";

const Home = () => {
  return (
    <Layout title={"Home"}>
      <section className="flex flex-col w-full h-full gap-8">
        <div className="flex justify-between">
          <CardNotification />
          <CardNotification />
          <CardNotification />
          <CardNotification />
        </div>

        <div className="flex h-80 gap-4 overflow-hidden">
          <div className="w-7/12 h-full min-h-full">
            <ContainerGraphics configGraphics={dataGraphics.firstHomeGraphic} />
          </div>

          <div className="w-5/12 h-full min-h-full">
            <ContainerGraphics configGraphics={dataGraphics.secondHomeGraphic} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;