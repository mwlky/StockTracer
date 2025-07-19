import { useEffect, useState } from "react";
import "./StockcardsGrid.css";
import Stockcard from "../stockcard/StockCard.tsx";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { fetchStockData } from "../general/Utils.ts";

const StockcardsGrid = ({
  stockcards,
  setStockcards,
}: {
  stockcards: any[];
  setStockcards: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const baseIds =
        stockcards.length > 0
          ? stockcards.map((c) => c.id)
          : JSON.parse(localStorage.getItem("stockcardsOrder") || "[]");

      if (baseIds.length === 0) {
        if (isInitialLoad) setIsLoading(false);
        return;
      }

      const updated = await Promise.all(
        baseIds.map(async (id: string) => {
          const data = await fetchStockData(id);
          return {
            id,
            price: data?.c?.toFixed(2) || "0.00",
            change: data?.dp?.toFixed(2) || "0.00",
          };
        })
      );

      setStockcards(updated);
    } catch (error) {
      console.error("Error updating stock data:", error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setStockcards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, movedItem);

        localStorage.setItem(
          "stockcardsOrder",
          JSON.stringify(updatedItems.map((item) => item.id))
        );

        return updatedItems;
      });
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="stockcards-container">
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
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
      )}
    </div>
  );
};

export default StockcardsGrid;
