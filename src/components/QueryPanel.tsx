import { useApp } from "@/context/AppContext";
import { Database } from "lucide-react";

export default function QueryPanel() {
  const { lastQuery } = useApp();
  
  return (
    <div className="query-panel sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex items-center gap-3">
        <Database className="h-4 w-4 text-query-label flex-shrink-0" />
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-query-label">SQL Query Executed:</span>
        <code className="text-sm text-query-text truncate">{lastQuery}</code>
      </div>
    </div>
  );
}
