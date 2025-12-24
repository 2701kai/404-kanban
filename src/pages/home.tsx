import { useState } from "react";
import Column from "@/components/board/column";
import { useBoard } from "@/context/board-context";
import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { columns, addColumn } = useBoard();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      // Generate a random color for the new column
      const colors = ["#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      addColumn({
        id: Date.now().toString(),
        name: newColumnName,
        color: randomColor
      });
      
      setNewColumnName("");
      setIsAddingColumn(false);
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">React Router Project</h1>
        <div className="flex gap-2">
          <div className="flex items-center text-sm text-textSecondary gap-1">
            <Eye className="h-4 w-4" />
            <span>Board</span>
          </div>
          <Button className="bg-primary hover:bg-opacity-80 text-background py-1.5 px-3 rounded-md text-sm font-medium flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      <div className="board-container flex gap-4 pb-4 overflow-x-auto h-[calc(100vh-140px)]">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
        
        {/* Add Column Button */}
        {isAddingColumn ? (
          <div className="column min-w-[280px] flex-shrink-0 flex flex-col bg-surface rounded-md border border-border">
            <div className="p-4">
              <Input
                type="text"
                placeholder="Enter column name..."
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="mb-2 bg-surfaceHover text-textPrimary border-border"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddingColumn(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleAddColumn}
                  className="bg-primary text-background"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="column min-w-[200px] flex-shrink-0 flex flex-col items-center justify-center bg-surface bg-opacity-50 rounded-md border border-dashed border-border hover:border-primary hover:bg-opacity-70 cursor-pointer"
            onClick={() => setIsAddingColumn(true)}
          >
            <Plus className="h-6 w-6 text-textSecondary mb-2" />
            <p className="text-textSecondary">Add Column</p>
          </div>
        )}
      </div>
    </div>
  );
}
