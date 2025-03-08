import React, { useState, useEffect } from "react";
import LinearGraphics from "./LinearGraphics";
import DonutGraphics from "./DonutGraphics";
import '../css/ContainerGraphics.css';

interface ConfigElement {
  title: string;
  position: number;
  button: string;
  type: string;
  configElements: {
    data: { time?: string; value: number; name?: string; color?:string }[];
    colors?: {
      backgroundColor?: string;
      lineColor?: string;
      textColor?: string;
      areaGradientStart?: string;
      areaGradientEnd?: string;
    };
  };
}

interface ContainerGraphicsProps {
  configGraphics: ConfigElement[];
}

const ContainerGraphics: React.FC<ContainerGraphicsProps> = ({
  configGraphics,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [transitionClass, setTransitionClass] = useState<string>("");
  const [showTitle, setShowTitle] = useState<boolean>(true);

  const handleTabClick = (index: number) => {
    if (index === selectedTab) return; 
    setShowTitle(false);
    if (index > selectedTab) {
      setTransitionClass("wipe-in-left");
    } else {
      setTransitionClass("wipe-in-right");
    }
    setSelectedTab(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(true);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [selectedTab]);

  const renderGraphic = (graphic: ConfigElement) => {
    const { type, configElements } = graphic;
    if (type === "linear") {
      const linearData = configElements.data.map(item => ({
        time: item.time!,
        value: item.value
      }));
      return <LinearGraphics data={linearData} colors={configElements.colors} />;
    } else if (type === "donut") {
      const donutData = configElements.data.map(item => ({
        name: item.name!,
        value: item.value,
        color: item.color
      }));
      return <DonutGraphics data={donutData} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto bg-white py-4 px-6 rounded-lg shadow-md h-full">
      <div className="w-full flex justify-between">
        <div className="w-2/3">
          {showTitle && (
            <h2 className="text-lg font-bold mb-4">
              {configGraphics[selectedTab].title}
            </h2>
          )}
        </div>

        <div className="flex justify-end gap-4 mb-4 w-1/3">
          {configGraphics.map((config, index) => (
            <button
              key={index}
              className={`px-4 py-2 cursor-pointer w-32 text-sm ${
                selectedTab === index ? "bg-primaryLila text-white" : "bg-gray-200 text-gray-700"
              } rounded transition duration-300 ease-in-out transform hover:scale-105 font-semibold`}
              onClick={() => handleTabClick(index)}
            >
              {config.button}
            </button>
          ))}
        </div>
      </div>
      <div className="text-center h-full">
        <div
          className={`transition-container ${transitionClass} h-full`}
          style={{
            backgroundColor:
              configGraphics[selectedTab].configElements.colors
                ?.backgroundColor || "white",
          }}
        >
          {renderGraphic(configGraphics[selectedTab])}
        </div>
      </div>
    </div>
  );
};

export default ContainerGraphics;