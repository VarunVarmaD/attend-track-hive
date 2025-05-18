
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
        "py-2 px-4 rounded-md transition-colors",
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
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-center md:text-left text-primary">
            Student Attendance Tracker
          </h1>
        </div>
      </header>

      <div className="container mt-8">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <nav className="bg-card p-4 rounded-lg shadow-sm">
            <div className="space-y-2">
              <NavLink to="/">Student List</NavLink>
              <NavLink to="/add-student">Add Student</NavLink>
              <NavLink to="/mark-attendance">Mark Attendance</NavLink>
              <NavLink to="/absentees">View Absentees</NavLink>
            </div>
          </nav>

          <main className="bg-card p-6 rounded-lg shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
