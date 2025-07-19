import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import "./StockCard.css";
import type { Stockcard } from "./Stockcard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const generateRandomChartData = (change: number) => {
  const pointsCount = 5;
  const startPrice = 100;
  const range = 5;
  let data: number[] = [];

  let current = startPrice + (Math.random() * 10 - 5);

  for (let i = 0; i < pointsCount - 1; i++) {
    let step = Math.random() * 10 - 5;

    if (change > 0) {
      step = Math.abs(step);
    } else {
      step = -Math.abs(step);
    }

    current += step;

    current = Math.min(Math.max(current, startPrice - range), startPrice + range);

    data.push(parseFloat(current.toFixed(2)));
  }

  let lastPoint = data.length > 0 ? data[data.length - 1] : current;
  if (change > 0) {
    lastPoint = lastPoint + Math.random() * 5 + 1; 
  } else {
    lastPoint = lastPoint - (Math.random() * 5 + 1);
  }
  data.push(parseFloat(lastPoint.toFixed(2)));

  return data;
};

const StockCard: React.FC<Stockcard> = ({
  title,
  price,
  change,
  chartData,
}) => {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: title });

  const data = React.useMemo(() => generateRandomChartData(change), [change]);

  const myChartData = React.useMemo(
    () => (
      {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "Price",
          data: data,
          borderColor: "#5a4de8",
          backgroundColor: "rgba(90, 77, 232, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 0,
        },
      ],
    }),
    [data]
  );

  const chartOptions = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false as const,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    }),
    []
  );

  const percentageClass =
    change >= 0 ? "percentage-text-positive" : "percentage-text-negative";

  const style = {
    transition, transform:  CSS.Transform.toString(transform)
  }

  return (
    <div className="stockcard" ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div className="info-container">
        <div className="numbers-container">
          <h1>{title}</h1>
          <div className="price-change">
            <p className="price-text">${price}</p>
            <p className={percentageClass}> {change}%</p>
          </div>
        </div>
        <div className="chart-container">
          <Line data={chartData ?? myChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default StockCard;
