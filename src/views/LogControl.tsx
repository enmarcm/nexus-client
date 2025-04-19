import React from "react";
import Layout from "../components/Layout";
import { FaList } from "react-icons/fa";
import { useLogContext } from "../context/LogContext";

const LogControl = () => {
  const { logs, totalLogs } = useLogContext();

  return (
    <Layout title="Control de Logs">
      <section className="flex flex-col w-full h-full gap-8 overflow-hidden">
        {/* Métrica de logs */}
        <div className="flex justify-between gap-16">
          <div className="flex items-center gap-4 bg-blue-100 p-4 rounded-md shadow-md">
            <FaList className="text-blue-500 text-3xl" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Total de Logs</h2>
              <p className="text-2xl font-bold text-blue-600">{totalLogs}</p>
            </div>
          </div>
        </div>

        {/* Tabla de logs */}
        <div className="w-full bg-white rounded-md shadow-lg p-6 overflow-hidden h-[calc(100vh-12rem)]">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Logs Recibidos</h2>
          <div className="overflow-y-auto h-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border-b border-gray-300 px-4 py-2">Hora</th>
                  <th className="border-b border-gray-300 px-4 py-2">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
                        {log.time}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
                        {log.message}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center text-gray-500 py-4">
                      No hay logs disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LogControl;