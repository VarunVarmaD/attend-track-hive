
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "py-2 px-4 rounded-md transition-colors flex items-center gap-2",
        isActive 
          ? "bg-primary text-primary-foreground font-medium" 
          : "hover:bg-muted text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary">
            Student Attendance Tracker
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <div className="container mt-8">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <aside className="bg-card p-4 rounded-lg shadow-sm border border-border h-fit">
            <nav>
              <div className="space-y-2 flex flex-col">
                <NavLink to="/">
                  <span className="flex-1">Student List</span>
                </NavLink>
                <NavLink to="/add-student">
                  <span className="flex-1">Add Student</span>
                </NavLink>
                <NavLink to="/mark-attendance">
                  <span className="flex-1">Mark Attendance</span>
                </NavLink>
                <NavLink to="/absentees">
                  <span className="flex-1">View Absentees</span>
                </NavLink>
              </div>
            </nav>
          </aside>

          <main className="bg-card p-6 rounded-lg shadow-sm border border-border">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
