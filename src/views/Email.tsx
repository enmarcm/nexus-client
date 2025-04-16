import React, { useState } from "react";
import Layout from "../components/Layout";


// Arreglar Tipado
const Emails: React.FC<any> = ({ configButton }) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    // const [transitionClass, setTransitionClass] = useState<string>("");
    // const [showTitle, setShowTitle] = useState<boolean>(true);

    // Arreglo que define cada pestaña
    const configEmailTabs = [
        {
            button: "HTML",
        },
        {
            button: "Text",
        },
    ];

    const handleTabClick = (index: number) => {
        if (index === selectedTab) return;
        if (index > selectedTab) {
            // setTransitionClass("wipe-in-left");
        } else {
            // setTransitionClass("wipe-in-right");
        }
        setSelectedTab(index);
    };
    return (
        <Layout title={"Correos"}>
            {/* <div className="container mx-auto bg-white py-4 px-6 rounded-lg shadow-md h-full">
                <div className="w-full flex justify-between">
                    <div className="w-8/12">
                    <button
                    className={`px-3 py-2 cursor-pointer w-32 text-sm bg-primaryLila text-white rounded-none first:rounded-l last:rounded-r transition duration-300 ease-in-out transform hover:scale-105 font-semibold`}
                     >
                     Usar plantilla
                     </button>
                    </div>
                </div>
            </div> */}
            <div className="flex mx-auto py-4 px-6 rounded-lg  h-full w-full gap-4">
                <div className="w-8/12 shadow-md bg-white rounded-lg p-4 flex justify-between">
                    <div className="w-2/3">
                    <button
                        className={`px-3 py-2 cursor-pointer w-full text-sm bg-primaryLila text-white rounded-none first:rounded-l last:rounded-r transition duration-300 ease-in-out transform hover:scale-105 font-semibold`}
                    >
                        Usar plantilla
                    </button>
                    </div>

                   <div>
                   {configEmailTabs.map((config, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 cursor-pointer w-20 text-sm ${selectedTab === index
                                ? "bg-primaryPink text-white"
                                : "bg-gray-200 text-gray-700"
                                } rounded-none first:rounded-l last:rounded-r transition duration-300 ease-in-out transform hover:scale-105 font-semibold`}
                            onClick={() => handleTabClick(index)}
                        >
                            {config.button}
                        </button>
                    ))}
                   </div>

                </div>

                <div className="w-4/12 shadow-md bg-white rounded-lg p-4">
                    sasas
                </div>
            </div>
        </Layout>
    )
}

export default Emails;