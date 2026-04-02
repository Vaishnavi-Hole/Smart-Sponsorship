import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Heart, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${location.pathname === path ? "text-primary" : "text-foreground/70"}`;

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Heart className="h-6 w-6 fill-accent text-accent" />
          KINDRED PATH
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/children" className={linkClass("/children")}>Children</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>

          {!user && (
            <>
              <Link to="/login" className="btn-pill bg-primary text-primary-foreground text-sm hover:opacity-90">Login</Link>
              <Link to="/register" className="btn-pill bg-accent text-accent-foreground text-sm hover:opacity-90">Sponsor Now</Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="flex items-center gap-1.5 btn-pill bg-primary text-primary-foreground text-sm">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          )}

          {user?.role === "sponsor" && (
            <Link to="/sponsor" className="flex items-center gap-1.5 btn-pill bg-primary text-primary-foreground text-sm">
              <LayoutDashboard className="h-4 w-4" /> My Dashboard
            </Link>
          )}

          {user && (
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/children" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Children</Link>
          <Link to="/about" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
          {!user && (
            <>
              <Link to="/login" className="block text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
          {user && (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-destructive">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
