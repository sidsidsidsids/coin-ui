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
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LineController,
  Title
);

export default function Chart({
  data,
  name_code,
}: {
  data: RawData;
  name_code: string;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const labels = data.map((item) => item.candle_date); // X축 라벨 (날짜)
    const tradePrices = data.map((item) => item.trade_price); // Trade Price
    const ma7 = data.map((item) => item.ma_7); // MA 7
    const ma14 = data.map((item) => item.ma_14); // MA 14
    const ma50 = data.map((item) => item.ma_50); // MA 50

    // Chart.js 인스턴스 생성
    const chart = new ChartJS(chartRef.current, {
      type: "line",
      data: {
        labels, // X축 데이터 (날짜)
        datasets: [
          {
            label: "종가",
            data: tradePrices,
            borderColor: "#3f4856",
            backgroundColor: "#3f4856",
            borderWidth: 3,
            fill: true,
          },
          {
            label: "7일 이동평균선 (MA_7)",
            data: ma7,
            borderColor: "#b45309",
            backgroundColor: "#b45309",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "14일 이동평균선 (MA_14)",
            data: ma14,
            borderColor: "#4d7c0f",
            backgroundColor: "#4d7c0f",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "50일 이동평균선 (MA_50)",
            data: ma50,
            borderColor: "#398983",
            backgroundColor: "#398983",
            borderWidth: 1,
            fill: false,
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
            position: "chartArea",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "일자",
            },
          },
          y: {
            title: {
              display: true,
              text: "가격",
            },
            beginAtZero: false,
          },
        },
        elements: {
          point: {
            radius: 1,
          },
        },
      },
    });

    // 컴포넌트 언마운트 시 차트 제거
    return () => {
      chart.destroy();
    };
  }, [data, name_code]);

  return <canvas ref={chartRef} width="400" height="200" />;
}
