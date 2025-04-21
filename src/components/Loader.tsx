import React from "react";
import { useLoader } from "../context/LoaderContext";
import "./css/Loader.css"

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;