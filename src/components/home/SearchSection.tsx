import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchSection = ({ searchQuery, setSearchQuery }: SearchSectionProps) => {
  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2 p-2 bg-white rounded-2xl shadow-lg border border-green-100 backdrop-blur-sm bg-white/90 hover:shadow-xl transition-all duration-300">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl bg-gray-50/50"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};