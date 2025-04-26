import React, { createContext, useContext, useEffect, useState } from "react";

interface LogEntry {
  time: string;
  message: string;
}

interface LogContextProps {
  logs: LogEntry[];
  totalLogs: number;
}

const LogContext = createContext<LogContextProps | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8085");

    ws.onopen = () => {
      console.log("Conectado al servidor WebSocket");
    };

    ws.onmessage = (event) => {
      // console.log("Mensaje recibido desde WebSocket:", event.data);

      const logData = JSON.parse(event.data);
      const newLog: LogEntry = {
        time: new Date().toLocaleTimeString(),
        message: logData.message || event.data,
      };

      setLogs((prevLogs) => {
        const updatedLogs = [newLog, ...prevLogs];
        setTotalLogs(updatedLogs.length);
        return updatedLogs;
      });
    };

    ws.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <LogContext.Provider value={{ logs, totalLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLogContext debe usarse dentro de un LogProvider");
  }
  return context;
};