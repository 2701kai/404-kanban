import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Home from "@/pages/home";
import Today from "@/pages/today";
import Archive from "@/pages/archive";
import { useEffect, useState } from "react";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background text-textPrimary">
          {/* Matrix-inspired background */}
          <div className="matrix-bg"></div>
          
          {/* Sidebar - hidden on mobile unless toggled */}
          <Sidebar 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen} 
            className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex`}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={toggleMobileMenu} />
            
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/today" element={<Today />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
