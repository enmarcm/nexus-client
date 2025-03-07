import { FaFolder } from "react-icons/fa";
import "./css/CardNotification.css";

const CardNotification = () => {
  //@ts-ignore
  const get40PercentColor = (color: string) => `${color}66`;

  return (
    <div
      className="hover:cursor-pointer card-notification bg-white w-1/5 h-28 gap-2 rounded-xl shadow-sm flex p-4 relative"
      style={{ "--icon-color": "#6B46C1" } as React.CSSProperties}
    >
      <div className="card-notification-bg"></div>
      <div className="card-notification-content w-full flex items-center justify-center z-10">
        <div className="w-1/3 flex items-center justify-center">
          <div className="rounded-full w-12 h-12 my-6 bg-transparentLila flex justify-center items-center">
            <FaFolder className="text-primaryLila shadow-sm" />
          </div>
        </div>

        <div className="h-full flex flex-col justify-center">
          <div>
            <h2 className="text-xl text-black font-bold">5</h2>
          </div>
          <div>
            <span className="text-md text-gray-400 font-light">E-MAILS</span>
          </div>
        </div>
      </div>

      <div className="card-notification-text">
        <span className="text-xl">VER MÁS </span>
      </div>
    </div>
  );
};

export default CardNotification;
