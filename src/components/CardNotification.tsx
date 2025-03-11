import React from "react";
import { IconType } from "react-icons";
import "./css/CardNotification.css";

interface CardNotificationProps {
  icon: IconType;
  color: string;
  quantity: number;
  content: string;
}

const CardNotification: React.FC<CardNotificationProps> = ({ icon: Icon, color, quantity, content }) => {
  const get40PercentColor = (color: string) => `${color}66`;

  return (
    <div
      className="hover:cursor-pointer card-notification bg-white w-full h-28 gap-2 rounded-xl shadow-sm flex p-4 relative"
      style={{ "--icon-color": color } as React.CSSProperties}
    >
      <div className="card-notification-bg"></div>

      <div className="card-notification-content w-full flex items-center justify-start z-10">
        <div className="w-1/3 flex items-center justify-center">
          <div className="rounded-full w-12 h-12 my-6 flex justify-center items-center" style={{ backgroundColor: get40PercentColor(color) }}>
            <Icon className="shadow-sm" style={{ color }} />
          </div>
        </div>

        <div className="h-full flex flex-col justify-center">
          <div>
            <h2 className="text-xl text-black font-bold">{quantity}</h2>
          </div>
          <div>
            <span className="text-md text-gray-400 font-light">{content}</span>
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