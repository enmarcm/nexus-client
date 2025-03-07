import CardNotification from "../components/CardNotification";
import Layout from "../components/Layout";

const Home = () => {
 
  return (
    <Layout title={"Home"}>
      <section className="flex flex-col w-full h-full gap-8">
        <div className="flex justify-around">
        <CardNotification/>
        <CardNotification/>
        <CardNotification/>
        <CardNotification/>

          


        </div>
      </section>
    </Layout>
  );
};

export default Home;
