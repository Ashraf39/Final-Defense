import { Star } from "lucide-react";
import { SearchSection } from "./SearchSection";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-[#f9fafb] py-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto text-center relative">
        <div className="animate-fade-in space-y-4">
          <div className="flex justify-center mb-4">
            <Star className="h-10 w-10 text-yellow-300 animate-pulse" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Your Health, Our Priority
          </h1>
          
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary mb-8">
            Find and order medicines from trusted pharmaceutical companies
          </p>
          
          <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
    </section>
  );
};