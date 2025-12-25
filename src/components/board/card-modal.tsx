import { useState, useEffect } from "react";
import { X, Download, ExternalLink, FileText, Link2, Calendar, User, Paperclip } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card as CardType, Comment } from "@/types";
import { useBoard } from "@/context/board-context";
import { formatDate, generateInitials } from "@/lib/utils";

interface CardModalProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardModal({ card, isOpen, onClose }: CardModalProps) {
  const { columns, updateCard, deleteCard } = useBoard();
  const [newComment, setNewComment] = useState("");
  const [editedCard, setEditedCard] = useState<CardType>({ ...card });
  
  // Reset the form when card changes
  useEffect(() => {
    setEditedCard({ ...card });
  }, [card]);

  const handleUpdateCard = () => {
    updateCard(editedCard);
  };

  const handleStatusChange = (columnId: string) => {
    setEditedCard({ ...editedCard, columnId });
    updateCard({ ...editedCard, columnId });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const updatedComments = [...(editedCard.comments || []), {
      id: Date.now().toString(),
      author: "Guest User",
      authorInitials: "GH",
      text: newComment,
      createdAt: new Date().toISOString()
    }];
    
    const updatedCard = { 
      ...editedCard, 
      comments: updatedComments, 
      commentCount: updatedComments.length 
    };
    
    setEditedCard(updatedCard);
    updateCard(updatedCard);
    setNewComment("");
  };

  const handleDeleteCard = () => {
    deleteCard(card.id);
    onClose();
  };
  
  // Get label color based on the first label
  const getLabelColorClass = (label: string) => {
    switch(label.toLowerCase()) {
      case 'react':
        return 'bg-primary bg-opacity-10 text-primary';
      case 'documentation':
        return 'bg-secondary bg-opacity-10 text-secondary';
      case 'pdf':
        return 'bg-accent bg-opacity-10 text-accent';
      case 'in progress':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'idea':
        return 'bg-success bg-opacity-10 text-success';
      default:
        return 'bg-primary bg-opacity-10 text-primary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface text-textPrimary max-w-4xl p-0 border-border">
        <div className="flex justify-between items-start p-6 pb-4">
          <div>
            {editedCard.labels && editedCard.labels.length > 0 && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLabelColorClass(editedCard.labels[0] ?? '')}`}>
                {editedCard.labels[0]}
              </span>
            )}
            <h2 className="text-xl font-semibold mt-2">{editedCard.title}</h2>
          </div>
          <button 
            className="text-textSecondary hover:text-textPrimary"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 pt-0">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-textSecondary mb-2">Description</h3>
              <Textarea
                className="bg-surfaceHover text-textPrimary border-border"
                value={editedCard.description || ""}
                onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                onBlur={handleUpdateCard}
                placeholder="Add a description..."
              />
            </div>
            
            {editedCard.attachments && editedCard.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-textSecondary mb-2">Attachments</h3>
                <div className="space-y-2">
                  {editedCard.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center p-2 rounded bg-surfaceHover">
                      {attachment.type === 'file' ? (
                        <FileText className="h-5 w-5 text-secondary mr-2" />
                      ) : (
                        <Link2 className="h-5 w-5 text-accent mr-2" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attachment.name}</p>
                        {attachment.size && <p className="text-xs text-textSecondary">{attachment.size}</p>}
                        {attachment.url && <p className="text-xs text-textSecondary">{attachment.url}</p>}
                      </div>
                      <button className="text-textSecondary hover:text-textPrimary">
                        {attachment.type === 'file' ? (
                          <Download className="h-4 w-4" />
                        ) : (
                          <ExternalLink className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-textSecondary mb-2">Comments</h3>
              <div className="space-y-3">
                {editedCard.comments && editedCard.comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-sm">{comment.authorInitials || generateInitials(comment.author)}</span>
                    </div>
                    <div className="flex-1 p-2 rounded bg-surfaceHover">
                      <p className="text-sm font-medium mb-1">{comment.author}</p>
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-textSecondary mt-1">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-sm">GH</span>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      className="w-full bg-surfaceHover text-textPrimary border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    {newComment && (
                      <div className="mt-2 flex justify-end">
                        <button
                          className="bg-primary hover:bg-opacity-80 text-background py-1 px-3 rounded-md text-sm"
                          onClick={handleAddComment}
                        >
                          Add Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-textSecondary mb-2">Status</h3>
              <Select
                value={editedCard.columnId}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full bg-surfaceHover text-textPrimary border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-surfaceHover text-textPrimary border-border">
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>{column.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-textSecondary mb-2">Assignee</h3>
              <div className="flex items-center gap-2 p-2 rounded bg-surfaceHover">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-white text-xs">GH</span>
                </div>
                <span className="text-sm">Guest User</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-textSecondary mb-2">Due Date</h3>
              <div className="p-2 rounded bg-surfaceHover flex items-center justify-between">
                <span className="text-sm">{formatDate(editedCard.createdAt)}</span>
                <Calendar className="h-4 w-4 text-textSecondary" />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-textSecondary mb-2">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {editedCard.labels && editedCard.labels.map((label, index) => (
                  <span 
                    key={index} 
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getLabelColorClass(label)}`}
                  >
                    {label}
                  </span>
                ))}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-surfaceHover text-textSecondary cursor-pointer">
                  + Add
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-textSecondary mb-2">Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 p-2 rounded bg-surfaceHover text-textSecondary hover:text-textPrimary text-sm text-left">
                  <Paperclip className="h-4 w-4" />
                  <span>Add Attachment</span>
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded bg-surfaceHover text-textSecondary hover:text-textPrimary text-sm text-left">
                  <User className="h-4 w-4" />
                  <span>Add Assignee</span>
                </button>
                <button 
                  className="w-full flex items-center gap-2 p-2 rounded bg-surfaceHover text-destructive hover:text-destructive text-sm text-left"
                  onClick={handleDeleteCard}
                >
                  <X className="h-4 w-4" />
                  <span>Delete Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
