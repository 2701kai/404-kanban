import { useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./card";
import { Plus, CircleCheck } from "lucide-react";
import { useBoard } from "@/context/board-context";
import { Column as ColumnType, Card as CardType } from "@/types";

interface ColumnProps {
  column: ColumnType;
  className?: string;
}

export default function Column({ column, className }: ColumnProps) {
  const { cards, addCard } = useBoard();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  // Get cards that belong to this column
  const columnCards = cards.filter(card => card.columnId === column.id);
  
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard({
        columnId: column.id,
        title: newCardTitle,
        description: "",
        labels: ["New"],
        attachmentCount: 0,
        commentCount: 0
      });
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };
  
  return (
    <div className={cn("column flex flex-col bg-surface rounded-md border border-border", className)}>
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: column.color }}></div>
          <h3 className="font-medium">{column.name}</h3>
          <span className="bg-surfaceHover text-xs rounded px-1.5 py-0.5 text-textSecondary">
            {columnCards.length}
          </span>
        </div>
        <button 
          className="text-textSecondary hover:text-textPrimary"
          onClick={() => setIsAddingCard(true)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto">
        {isAddingCard ? (
          <div className="card mb-2 p-3 bg-surfaceHover rounded-md border border-primary">
            <input
              type="text"
              className="w-full bg-surface text-textPrimary border border-border rounded-md p-2 text-sm mb-2"
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button 
                className="text-textSecondary hover:text-textPrimary text-sm"
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-primary hover:bg-opacity-80 text-background py-1 px-2 rounded-md text-sm"
                onClick={handleAddCard}
              >
                Add
              </button>
            </div>
          </div>
        ) : null}
        
        {columnCards.length > 0 ? (
          columnCards.map((card: CardType) => (
            <Card key={card.id} card={card} />
          ))
        ) : !isAddingCard ? (
          <div className="text-center p-4 text-textSecondary flex flex-col items-center justify-center h-full">
            <CircleCheck className="h-8 w-8 mb-2" />
            <p>Keine Aufgaben</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
