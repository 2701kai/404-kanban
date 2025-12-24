import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Archive, 
  CodeSquare, 
  Database, 
  Menu, 
  FoldHorizontal 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

export default function Sidebar({ isOpen, setIsOpen, className }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div 
      className={cn(
        "flex flex-col w-64 bg-surface border-r border-border z-20", 
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-background font-semibold">404</span>
          </div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <button 
          className="text-textSecondary hover:text-textPrimary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FoldHorizontal className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-textSecondary uppercase tracking-wider px-3 mb-1">Main</p>
          <ul>
            <li>
              <Link 
                to="/"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md",
                  currentPath === "/" 
                    ? "text-textPrimary bg-surfaceActive" 
                    : "text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/today"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md",
                  currentPath === "/today" 
                    ? "text-textPrimary bg-surfaceActive" 
                    : "text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
                )}
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Today</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/archive"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md",
                  currentPath === "/archive" 
                    ? "text-textPrimary bg-surfaceActive" 
                    : "text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
                )}
              >
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-textSecondary uppercase tracking-wider px-3 mb-1">Projects</p>
          <ul>
            <li>
              <Link 
                to="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
              >
                <CodeSquare className="h-4 w-4" />
                <span>React Learning</span>
              </Link>
            </li>
            <li>
              <Link 
                to="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
              >
                <Database className="h-4 w-4" />
                <span>MERN Project</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="px-3 mt-auto">
          <div className="p-3 rounded-md bg-surfaceHover">
            <p className="text-sm text-textSecondary mb-2">Storage</p>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <p className="text-xs text-textSecondary mt-2">2.4GB / 5GB used</p>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white text-sm font-medium">GH</span>
          </div>
          <div>
            <p className="text-sm font-medium">Guest User</p>
            <p className="text-xs text-textSecondary">guest@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
