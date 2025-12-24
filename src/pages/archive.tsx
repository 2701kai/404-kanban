import { useState } from "react";
import { useBoard } from "@/context/board-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Archive as ArchiveIcon, Search, FileText, Folder, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardModal from "@/components/board/card-modal";
import { Card as CardType } from "@/types";

export default function Archive() {
  const { archivedCards, restoreCard } = useBoard();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
  // Filter archived cards based on search query
  const filteredCards = archivedCards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };
  
  const handleRestore = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    restoreCard(cardId);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ArchiveIcon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Archive</h1>
        </div>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
        <Input
          placeholder="Search archived items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-surfaceHover text-textPrimary border-border"
        />
      </div>
      
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className="bg-surface border-border hover:border-primary cursor-pointer transition-all"
              onClick={() => handleCardClick(card)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="h-5 w-5 text-textSecondary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{card.title}</h3>
                      {card.description && (
                        <p className="text-sm text-textSecondary mb-2 line-clamp-2">{card.description}</p>
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
                          Archived {formatDate(card.archivedAt || card.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-textSecondary hover:text-primary"
                    title="Restore"
                    onClick={(e) => handleRestore(e, card.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed border-border rounded-lg">
          <Folder className="h-12 w-12 mx-auto mb-3 text-textSecondary" />
          <h3 className="text-lg font-medium mb-2">No archived items</h3>
          <p className="text-textSecondary">
            {searchQuery ? 
              "No items match your search criteria." :
              "You don't have any archived items. Archived items will appear here."
            }
          </p>
        </div>
      )}
      
      {selectedCard && (
        <CardModal 
          card={selectedCard} 
          isOpen={!!selectedCard} 
          onClose={() => setSelectedCard(null)} 
        />
      )}
    </div>
  );
}
