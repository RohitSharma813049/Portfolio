"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function ClientSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate network request
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="relative flex items-center w-full max-w-lg mb-8 shadow-sm group">
      <Search className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-[#D8C494] transition-colors" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search projects, authors, categories..." 
        className="w-full pl-12 pr-32 py-4 rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-[#D8C494] transition-all bg-white"
      />
      <button 
        onClick={handleSearch}
        disabled={isSearching}
        className="absolute right-2 bg-black hover:bg-[#D8C494] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center justify-center min-w-[90px]"
      >
        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
      </button>
    </div>
  );
}
