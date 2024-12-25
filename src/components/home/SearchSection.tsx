import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchSection = ({ searchQuery, setSearchQuery }: SearchSectionProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className={`flex gap-2 p-2 bg-white rounded-2xl shadow-lg border border-green-100 backdrop-blur-sm bg-white/90 transition-all duration-300 ${isFocused ? 'shadow-xl scale-105' : 'hover:shadow-xl hover:scale-110'}`}>
          <div className="relative flex-grow group">
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Delay hiding results to allow for click events
                setTimeout(() => setIsFocused(false), 200);
              }}
              className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl bg-white transition-transform duration-300 focus:scale-[1.02] origin-center"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            Search
          </Button>
        </div>
      </div>
      {/* Pass isFocused state to parent for controlling search results visibility */}
      {isFocused && searchQuery.trim() !== "" && <div className="absolute inset-x-0 top-full" />}
    </section>
  );
};