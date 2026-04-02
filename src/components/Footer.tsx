import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-12 py-10">
      <div className="container mx-auto px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary font-bold text-lg">
          <Heart className="h-5 w-5 fill-accent text-accent" />
          Kindred Path NGO
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; 2024 Kindred Path NGO. Smart Child Sponsorship Management System — DBMS Demonstration.
        </p>
      </div>
    </footer>
  );
}
