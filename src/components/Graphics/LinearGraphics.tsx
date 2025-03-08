import React, { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  DeepPartial,
  AreaSeriesOptions,
} from 'lightweight-charts';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface ChartColors {
  backgroundColor?: string;
  lineColor?: string;
  textColor?: string;
  areaGradientStart?: string;
  areaGradientEnd?: string;
}

interface ChartComponentProps {
  data: ChartDataPoint[];
  title?: string;
  colors?: ChartColors;
}

const LinearGraphics: React.FC<ChartComponentProps> = ({
  data,
  title,
  colors = {},
}) => {
  const {
    backgroundColor = 'white',
    lineColor = 'transparent', 
    textColor = '#A0A0A0',
    areaGradientStart = '#3A36DB',
    areaGradientEnd = '#FF69B4',
  } = colors;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        fontFamily: 'DM Sans, sans-serif',
      },
      width: container.clientWidth,
      height: container.clientHeight,
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: true },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
    });

    chart.timeScale().fitContent();

    const areaSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaGradientStart,
      bottomColor: areaGradientEnd, 
    } as DeepPartial<AreaSeriesOptions>);
    areaSeries.setData(data);

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
        chart.timeScale().fitContent();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaGradientStart, areaGradientEnd]);

  return (
    <div ref={chartContainerRef} className="w-full min-h-[15rem] h-fit" />
  );
};

export default LinearGraphics;