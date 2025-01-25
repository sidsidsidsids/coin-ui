"use client";
type RawDataItem = {
  id: number;
  korean_name: string;
  name_code: string;
  candle_date: string;
  trade_price: number;
  change_price: number | null;
  ma_7: number | null;
  ma_14: number | null;
  ma_50: number | null;
  rsi: number | null;
  score: number;
};
type RawData = RawDataItem[];
type ForecastData = {
  shortTermAccuracy: string | number;
  mediumTermAccuracy: string | number;
  longTermAccuracy: string | number;
  recommendation: string;
};

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LineController,
  Title,
  SubTitle,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LineController,
  Title,
  SubTitle,
  Filler
);

export default function Chart({
  data,
  name_code,
  forecast,
}: {
  data: RawData;
  name_code: string;
  forecast: ForecastData;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const labels = data.map((item) => item.candle_date); // X축 라벨 (날짜)
    const tradePrices = data.map((item) => item.trade_price); // 종가
    const ma7 = data.map((item) => item.ma_7); // MA 7
    const ma14 = data.map((item) => item.ma_14); // MA 14
    const ma50 = data.map((item) => item.ma_50); // MA 50
    const rsi = data.map((item) => item.rsi); // RSI

    const chart = new ChartJS(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "종가",
            data: tradePrices,
            borderColor: "#3f4856",
            backgroundColor: "#3f4856",
            borderWidth: 3,
          },
          {
            label: "7일 이동평균선 (MA_7)",
            data: ma7,
            borderColor: "#b45309",
            backgroundColor: "#b45309",
            borderWidth: 1,
          },
          {
            label: "14일 이동평균선 (MA_14)",
            data: ma14,
            borderColor: "#4d7c0f",
            backgroundColor: "#4d7c0f",
            borderWidth: 1,
          },
          {
            label: "50일 이동평균선 (MA_50)",
            data: ma50,
            borderColor: "#398983",
            backgroundColor: "#398983",
            borderWidth: 1,
          },
          {
            label: "RSI",
            data: rsi,
            borderColor: "rgba(226,232,240,0.8)",
            backgroundColor: "rgba(226,232,240,0.6)",
            borderWidth: 0.2,
            yAxisID: "y1",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${name_code}/KRW 차트`,
            position: "top",
            font: {
              size: 36,
              weight: "bold",
            },
          },
          legend: {
            position: "bottom",
          },
          subtitle: {
            display: true,
            text: `기술지표 기반 추천 : ${
              forecast.recommendation
            } ${"   "}   [해당 종목 추천 정확도 : 단기(1일) ${
              forecast.shortTermAccuracy
            }% / 중기(14일) ${forecast.mediumTermAccuracy}% / 장기(50일) ${
              forecast.longTermAccuracy
            }%]`,
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "날짜",
            },
            grid: {
              drawTicks: true,
              color: "transparent",
            },
          },
          y: {
            title: {
              display: true,
              text: "가격 (KRW)",
            },
            beginAtZero: false,
            grid: {
              drawTicks: true,
              color: "transparent",
            },
          },
          y1: {
            title: {
              display: true,
              text: "RSI",
            },
            position: "right",
            beginAtZero: true,
            min: 0,
            max: 100,
            grid: {
              drawTicks: true,
              color: (context) => {
                if (context.tick.value === 30 || context.tick.value === 70) {
                  return "rgba(226,232,240,1)";
                }
                return "transparent";
              },
            },
          },
        },
        elements: {
          point: {
            radius: 2,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data, name_code, forecast]);

  return <canvas ref={chartRef} width="400" height="200" />;
}
