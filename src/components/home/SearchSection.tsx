import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchSection = ({ searchQuery, setSearchQuery }: SearchSectionProps) => {
  return (
    <section className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2 p-3 bg-white rounded-full shadow-lg border border-green-100">
          <Input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
          />
          <Button className="rounded-full bg-green-600 hover:bg-green-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};