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
import { fetchStockData } from "../Utils.ts";

const StockcardsGrid = ({
  stockcards,
  setStockcards,
}: {
  stockcards: any[];
  setStockcards: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const fetchData = async () => {
    try {
      const updated = await Promise.all(
        stockcards.map(async (card) => {
          const data = await fetchStockData(card.id);
          return {
            id: card.id,
            price: data?.c?.toFixed(2) || "0.00",
            change: data?.dp?.toFixed(2) || "0.00",
          };
        })
      );

      const savedOrder = JSON.parse(
        localStorage.getItem("stockcardsOrder") || "[]"
      );
      if (savedOrder.length > 0) {
        const ordered = savedOrder
          .map((id: string) => updated.find((c) => c.id === id))
          .filter(Boolean);
        setStockcards(ordered);
      } else {
        setStockcards(updated);
      }
    } catch (error) {
      console.error("Error updating stock data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
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

        localStorage.setItem(
          "stockcardsOrder",
          JSON.stringify(updatedItems.map((item) => item.id))
        );

        return updatedItems;
      });
    }
  }

  const sensors = useSensors(useSensor(PointerSensor));

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
