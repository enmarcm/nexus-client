import React, { createContext, useState, useContext } from "react";

interface LoaderContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoaderContext = createContext<LoaderContextProps>({
  loading: false,
  setLoading: () => {},
});

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

export default LoaderContext;