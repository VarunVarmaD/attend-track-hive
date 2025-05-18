
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import AddStudentPage from "./pages/AddStudentPage";
import MarkAttendancePage from "./pages/MarkAttendancePage";
import AbsenteesPage from "./pages/AbsenteesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-student" element={<AddStudentPage />} />
            <Route path="/mark-attendance" element={<MarkAttendancePage />} />
            <Route path="/absentees" element={<AbsenteesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
