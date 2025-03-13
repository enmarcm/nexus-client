import React, { useState } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

interface TableProps {
  columns: string[];
  data: { [key: string]: any }[];
}

interface SortConfig {
  key: string;
  direction: string;
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
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
                    {getClassNamesFor(column) === "descending" && <FaSortDown />}
                  </span>
                </div>
              </th>
            ))}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;