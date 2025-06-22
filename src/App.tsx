import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import Index from "./pages/Index";

const App: React.FC = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Index />
  </TooltipProvider>
);

export default App;
