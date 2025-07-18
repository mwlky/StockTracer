import { useEffect, useState } from "react";
import "./StockcardsGrid.css";
import Stockcard from "../stockcard/StockCard.tsx";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { fetchStockData } from "../Utils.ts";

const StockcardsGrid = () => {
  const stocks = ["AAPL", "GOOGL", "AMZN", "MSFT"];
  const [stockcards, setStockcards] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const updatedStockcards = await Promise.all(
        stocks.map(async (symbol) => {
          const data = await fetchStockData(symbol);
          return {
            id: symbol,
            price: data?.c ? data.c.toFixed(2) : 0,
            change: data?.dp ? data.dp.toFixed(2) : "0.00",
          };
        })
      );

      const savedOrder = JSON.parse(localStorage.getItem("stockcardsOrder") || "[]");
      if (savedOrder.length > 0) {
        const orderedStockcards = savedOrder.map((id: string) =>
          updatedStockcards.find((card) => card.id === id)
        );
        setStockcards(orderedStockcards.filter(Boolean));
      } else {
        setStockcards(updatedStockcards);
      }

    } catch (error) {
      console.error("Błąd przy pobieraniu danych o akcjach:", error);
    }
  };

  useEffect(() => {
    fetchData(); 
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStockcards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const updatedItems = [...items];
        updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, items[oldIndex]);

        localStorage.setItem("stockcardsOrder", JSON.stringify(updatedItems.map(item => item.id)));

        return updatedItems;
      });
    }
  }

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  return (
    <div className="stockcards-container">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={stockcards.map((card) => card.id)}>
          {stockcards.map((stockcard) => (
            <Stockcard
              key={stockcard.id}
              title={stockcard.id}
              price={stockcard.price}
              change={stockcard.change}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default StockcardsGrid;
