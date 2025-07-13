import { useState } from "react";

import "./StockcardsGrid.css";
import Stockcard from "../stockcard/StockCard.tsx";

const StockcardsGrid = () => {
  const [stockcards, setStockcards] = useState([
    { title: "AAPL", price: 150, change: 1.5 },
    { title: "GOOGL", price: 2800, change: -0.5 },
    { title: "AMZN", price: 3400, change: 2.0 },
    { title: "MSFT", price: 299, change: 0.8 },
    { title: "TSLA", price: 700, change: -1.2 },
    { title: "NFLX", price: 550, change: 1.0 },
    { title: "FB", price: 350, change: 0.5 },
    { title: "NVDA", price: 220, change: -0.3 },
    { title: "DIS", price: 180, change: 1.8 },
    { title: "V", price: 250, change: -0.7 },
]);


  return <div className="stockcards-container">
    {stockcards.map((stockcard) => (
      <Stockcard key={stockcard.Title} title={stockcard.Title} price={stockcard.Price} change={stockcard.Change}  />
    ))}
  </div>;
};

export default StockcardsGrid;
