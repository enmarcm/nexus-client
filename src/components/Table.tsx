import React, { useState } from "react";
import { FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";

interface TableProps {
  columns: string[];
  data: { [key: string]: any }[];
  editable?: boolean; // Prop para habilitar edición
  erasable?: boolean; // Prop para habilitar eliminación
  onEdit?: (row: { [key: string]: any }) => void; // Callback para editar
  onErase?: any;
  modalComponent?: React.ReactNode; // Componente modal completo
}

interface SortConfig {
  key: string;
  direction: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  editable = false,
  erasable = false,
  onEdit,
  onErase,
  modalComponent,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRow, setSelectedRow] = useState<{ [key: string]: any } | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Límites por página

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (key: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key ? sortConfig.direction : undefined;
  };

  const handleEdit = (row: { [key: string]: any }) => {
    setSelectedRow(row);
    if (onEdit) onEdit(row);
  };

  const handleErase = async (row: { [key: string]: any }) => {
    setSelectedRow(row);
    if (onErase) await onErase(row);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reinicia a la primera página
  };

  return (
    <div className="w-full">
      {/* Controles de paginación y filas por página */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span
            className="text-gray-700 text-sm font-medium text-center"
            style={{ minWidth: "120px" }} // Ancho fijo para evitar cambios
          >
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700 text-sm font-medium">Filas por página:</span>
          <select
            className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24" // Ancho más grande
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Tabla con scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-4 px-6 bg-white text-gray-500 font-bold uppercase text-sm text-left cursor-pointer"
                  onClick={() => requestSort(column)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column}</span>
                    <span className="w-4 flex justify-center">
                      {getClassNamesFor(column) === "ascending" && <FaSortUp />}
                      {getClassNamesFor(column) === "descending" && (
                        <FaSortDown />
                      )}
                    </span>
                  </div>
                </th>
              ))}
              {(editable || erasable) && (
                <th className="py-4 px-6 bg-white text-gray-500 font-bold uppercase text-sm text-left">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-4 px-6 border-b border-gray-200 text-gray-600 text-left"
                  >
                    {row[column]}
                  </td>
                ))}
                {(editable || erasable) && (
                  <td className="py-4 px-6 border-b border-gray-200 text-gray-600 text-left">
                    <div className="flex gap-2">
                      {editable && (
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEdit(row)}
                        >
                          <FaEdit />
                        </button>
                      )}
                      {erasable && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleErase(row)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Renderiza el componente modal completo si se pasa */}
      {modalComponent && selectedRow && modalComponent}
    </div>
  );
};

export default Table;