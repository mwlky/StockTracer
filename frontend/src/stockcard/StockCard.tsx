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

const StockCard: React.FC<Stockcard> = ({
  title,
  price,
  change,
  chartData,
}) => {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: title });

  const myChartData = React.useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "Price",
          data: [100, 105, 102, 108, 110],
          borderColor: "#5a4de8",
          backgroundColor: "rgba(90, 77, 232, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    []
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
