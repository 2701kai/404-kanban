import { useState } from "react";
import { useBoard } from "@/context/board-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Plus, Calendar, FileText, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card as CardType } from "@/types";

export default function Today() {
  const { cards, addCard } = useBoard();
  const [newTask, setNewTask] = useState("");
  
  // Filter cards that were created today
  const todayCards = cards.filter(card => {
    const cardDate = new Date(card.createdAt);
    const today = new Date();
    return (
      cardDate.getDate() === today.getDate() &&
      cardDate.getMonth() === today.getMonth() &&
      cardDate.getFullYear() === today.getFullYear()
    );
  });

  const handleAddTask = () => {
    if (newTask.trim()) {
      // Add a new card to the first column (assuming the first column is for new tasks)
      addCard({
        columnId: "1",
        title: newTask,
        description: "Created from Today's tasks",
        labels: ["Task"],
        attachmentCount: 0,
        commentCount: 0
      });
      setNewTask("");
    }
  };
  
  const renderCardIcon = (card: CardType) => {
    if (card.labels && card.labels.length > 0) {
      const label = (card.labels[0] ?? '').toLowerCase();
      if (label.includes('react') || label.includes('code')) {
        return <FileText className="h-5 w-5 text-primary" />;
      } else if (label.includes('documentation')) {
        return <FileText className="h-5 w-5 text-secondary" />;
      } else if (label.includes('pdf')) {
        return <FileText className="h-5 w-5 text-accent" />;
      } else if (label.includes('idea')) {
        return <Link className="h-5 w-5 text-success" />;
      }
    }
    return <CheckCircle2 className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Today's Tasks</h1>
        </div>
        <span className="text-sm text-textSecondary">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      <Card className="mb-6 bg-surface border-border">
        <CardHeader className="pb-3">
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Tasks added here will appear in your board</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="bg-surfaceHover text-textPrimary border-border"
            />
            <Button
              className="bg-primary hover:bg-opacity-80 text-background"
              onClick={handleAddTask}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-medium mb-4">Today's Items ({todayCards.length})</h2>
      
      {todayCards.length > 0 ? (
        <div className="space-y-3">
          {todayCards.map((card) => (
            <Card key={card.id} className="bg-surface border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Checkbox id={`task-${card.id}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {renderCardIcon(card)}
                      <label 
                        htmlFor={`task-${card.id}`} 
                        className="text-base font-medium hover:text-primary cursor-pointer"
                      >
                        {card.title}
                      </label>
                    </div>
                    {card.description && (
                      <p className="text-sm text-textSecondary mb-2">{card.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {card.labels && card.labels.map((label, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs px-2 py-0.5 rounded-full bg-primary bg-opacity-10 text-primary"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-textSecondary">
                        {formatDate(card.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed border-border rounded-lg">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-textSecondary" />
          <h3 className="text-lg font-medium mb-2">No tasks for today</h3>
          <p className="text-textSecondary">
            You don't have any tasks scheduled for today. Add a new task to get started.
          </p>
        </div>
      )}
    </div>
  );
}
