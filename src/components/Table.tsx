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

  return (
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
          {sortedData.map((row, rowIndex) => (
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

      {/* Renderiza el componente modal completo si se pasa */}
      {modalComponent && selectedRow && modalComponent}
    </div>
  );
};

export default Table;
