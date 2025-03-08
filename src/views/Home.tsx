import CardNotification from "../components/CardNotification";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout title={"Home"}>
      <section className="flex flex-col w-full h-full gap-8">
        <div className="flex justify-around">
          <CardNotification />
          <CardNotification />
          <CardNotification />
          <CardNotification />
        </div>

        <div className="flex min-h-80">
          <div className="w-7/12 h-full min-h-full">
          </div>

          <div className="w-5/12 h-full min-h-full"></div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
