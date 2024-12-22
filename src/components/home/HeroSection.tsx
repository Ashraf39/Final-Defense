import { Star } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f9fafb] py-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto text-center relative">
        <div className="animate-fade-in space-y-4">
          <div className="flex justify-center mb-4">
            <Star className="h-10 w-10 text-yellow-300 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            Your Health, Our Priority
          </h1>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-primary">
            Find and order medicines from trusted pharmaceutical companies
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <div className="animate-bounce-slow">
              <Star className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="animate-bounce-slow delay-100">
              <Star className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="animate-bounce-slow delay-200">
              <Star className="h-6 w-6 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};