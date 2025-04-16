import React from "react";
import LanguageSelector from "./LanguageSelector";

const Layout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-backgroundWhite min-h-screen  flex flex-col">
      <div className="flex justify-between items-center h-7 my-2 px-8 py-4">
        <div>
          <h1 className="text-xl text-gray-700 font-bold">{title}</h1>
        </div>
        <div>
          <LanguageSelector />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;