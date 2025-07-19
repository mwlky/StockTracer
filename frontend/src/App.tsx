import { useEffect, useState } from "react";
import "./App.css";
import Divider from "./divider/Divider";
import Searchbar from "./searchbar/Searchbar";
import { fetchStockData } from "./general/Utils";
import StockcardsGrid from "./stockcardsGrid/StockcardsGrid";

const DEFAULT_STOCKS = ["AAPL", "GOOGL", "AMZN", "MSFT"];

function App() {
  const [stockcards, setStockcards] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const existing = localStorage.getItem("stockcardsOrder");

      let initialStocks = DEFAULT_STOCKS;
      if (existing) {
        const savedIds = JSON.parse(existing);
        initialStocks = savedIds;
      }

      const data = await Promise.all(
        initialStocks.map(async (symbol) => {
          const d = await fetchStockData(symbol);
          return {
            id: symbol,
            price: d?.c?.toFixed(2) || "0.00",
            change: d?.dp?.toFixed(2) || "0.00",
          };
        })
      );

      setStockcards(data);
    };

    init();
  }, []);

  const addStockcard = (stock: string) => {
    if (stockcards.some((s) => s.id === stock)) return;

    const newStockcard = {
      id: stock,
      price: "0.00",
      change: "0.00",
    };

    const updated = [...stockcards, newStockcard];
    setStockcards(updated);
    localStorage.setItem("stockcardsOrder", JSON.stringify(updated.map((s) => s.id)));
  };

  return (
    <>
      <div className="main-content">
        <h1>Stock Exchange Dashboard</h1>
        <Searchbar addStock={addStockcard} />
        <Divider />
        <StockcardsGrid stockcards={stockcards} setStockcards={setStockcards} />
      </div>
    </>
  );
}

export default App;
