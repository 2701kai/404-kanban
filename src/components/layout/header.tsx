import { Search, Menu, Plus, Bell, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: (e: React.MouseEvent) => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-4 text-textSecondary hover:text-textPrimary"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="bg-surfaceHover text-textPrimary border border-border rounded-md pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-9 w-[200px] md:w-[240px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
          title="Create new"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
