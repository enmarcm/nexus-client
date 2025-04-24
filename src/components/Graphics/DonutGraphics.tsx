import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout } from "echarts/features";

// Utilizamos los componentes necesarios de ECharts
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

interface DonutGraphicsDataItem {
  value: number;
  name: string;
  color?: string;
}

interface DonutGraphicsProps {
  data: DonutGraphicsDataItem[];
  width?: string | number;
  height?: string | number;
}

const DonutGraphics: React.FC<DonutGraphicsProps> = ({
  data,
  width = "100%",
  height = "15rem",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Colores predeterminados que se usarán si no se pasa el color
  const defaultColors = ["#95DA33", "#33FF57", "#3357FF", "#57FF33", "#FF33A0"];

  // Definimos las opciones predeterminadas del gráfico
  const getDefaultOptions = () => {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: "5%", // Movemos la leyenda debajo del gráfico
        left: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderWidth: 5,
            borderColor: "white"
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "sans-serif",
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color || defaultColors[index % defaultColors.length], // Si no tiene color, asigna uno por defecto
            },
          })),
          animationType: "expansive", // Cambiamos a "scale" para una animación de apertura más visible
          animationEasing: "elasticOut", // Efecto de suavizado en la animación
          animationDuration: 2000, // Duración de la animación
        },
      ],
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      // Inicializamos el gráfico solo si el contenedor está presente
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(getDefaultOptions());

      // Usamos ResizeObserver para ajustar el tamaño del gráfico cuando el contenedor cambia de tamaño
      const resizeObserver = new ResizeObserver(() => {
        chartInstance.current?.resize();
      });

      // resizeObserver.observe(chartRef.current);

      // Cleanup ResizeObserver y chart instance on component unmount
      return () => {
        resizeObserver.disconnect();
        chartInstance.current?.dispose();
      };
    }
  }, [data]); // El gráfico se actualiza si los datos cambian

  return (
    <div
      ref={chartRef}
      style={{
        marginTop: "-1.2rem",
        width: width || "100%",
        height: height || "15rem",
        minHeight: "3.2rem",
      }}
    />
  );
};

export default DonutGraphics;