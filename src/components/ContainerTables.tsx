import React, { useState, useEffect } from "react";
import Table from "./Table";
import "./css/ContainerGraphics.css";

interface TableConfig {
  title: string;
  button: string;
  columns: string[];
  data: { [key: string]: any }[];
}

interface ContainerTablesProps {
  configTables: TableConfig[];
}

const ContainerTables: React.FC<ContainerTablesProps> = ({ configTables }) => {
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

  return (
    <div className="container mx-auto bg-white py-4 px-6 rounded-lg shadow-md h-full">
      <div className="w-full flex justify-between">
        <div className="w-2/3">
          {showTitle && (
            <h2 className="text-lg font-bold mb-4">
              {configTables[selectedTab].title}
            </h2>
          )}
        </div>

        <div className="flex justify-end mb-4 w-1/3">
          {configTables.map((config, index) => (
            <button
              key={index}
              className={`px-4 py-2 cursor-pointer w-32 text-sm ${
                selectedTab === index ? "bg-primaryLila text-white" : "bg-gray-200 text-gray-700"
              } rounded-none first:rounded-l last:rounded-r transition duration-300 ease-in-out transform hover:scale-105 font-semibold`}
              onClick={() => handleTabClick(index)}
            >
              {config.button}
            </button>
          ))}
        </div>
      </div>
      <div className="text-center h-full overflow-hidden">
        <div className={`transition-container ${transitionClass} h-full w-full`}>
          <Table columns={configTables[selectedTab].columns} data={configTables[selectedTab].data} />
        </div>
      </div>
    </div>
  );
};

export default ContainerTables;