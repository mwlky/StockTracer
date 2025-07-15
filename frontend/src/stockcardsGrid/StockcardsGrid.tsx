import { useState } from "react";

import "./StockcardsGrid.css";
import Stockcard from "../stockcard/StockCard.tsx";

import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

const StockcardsGrid = () => {
  const [stockcards, setStockcards] = useState([
    { id: "AAPL", price: 150, change: 1.5 },
    { id: "GOOGL", price: 2800, change: -0.5 },
    { id: "AMZN", price: 3400, change: 2.0 },
    { id: "MSFT", price: 299, change: 0.8 },
    { id: "TSLA", price: 700, change: -1.2 },
    { id: "NFLX", price: 550, change: 1.0 },
    { id: "FB", price: 350, change: 0.5 },
    { id: "NVDA", price: 220, change: -0.3 },
    { id: "DIS", price: 180, change: 1.8 },
    { id: "V", price: 250, change: -0.7 },
  ]);

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStockcards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const updatedItems = [...items];
        updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, items[oldIndex]);

        return updatedItems;
      });
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

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
