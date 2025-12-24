import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { MoreHorizontal, Paperclip, MessageSquare } from "lucide-react";
import { Card as CardType } from "@/types";
import CardModal from "./card-modal";

interface CardProps {
  card: CardType;
  className?: string;
}

export default function Card({ card, className }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get label color class based on the first label
  const getLabelColorClass = (label: string) => {
    switch(label.toLowerCase()) {
      case 'react':
        return 'text-primary border-primary bg-surface';
      case 'documentation':
        return 'text-secondary border-secondary bg-surface';
      case 'pdf':
        return 'text-accent border-accent bg-surface';
      case 'in progress':
        return 'text-warning border-warning bg-surface';
      case 'idea':
        return 'text-success border-success bg-surface';
      default:
        return 'text-primary border-primary bg-surface';
    }
  };
  
  return (
    <>
      <div 
        className={cn(
          "card mb-2 p-3 bg-surfaceHover rounded-md border border-border hover:border-primary cursor-pointer",
          className
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          {card.labels && card.labels.length > 0 && (
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              getLabelColorClass(card.labels[0])
            )}>
              {card.labels[0]}
            </span>
          )}
          <button 
            className="text-textSecondary hover:text-textPrimary text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // Open menu or actions here
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        
        <h4 className="font-medium mb-1">{card.title}</h4>
        
        {card.description && (
          <p className="text-sm text-textSecondary mb-2">{card.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-textSecondary">{formatDate(card.createdAt)}</span>
          <div className="flex items-center gap-2">
            {card.attachmentCount > 0 && (
              <span className="flex items-center gap-1 text-textSecondary">
                <Paperclip className="h-3 w-3" /> {card.attachmentCount}
              </span>
            )}
            {card.commentCount > 0 && (
              <span className="flex items-center gap-1 text-textSecondary">
                <MessageSquare className="h-3 w-3" /> {card.commentCount}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <CardModal 
          card={card} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
