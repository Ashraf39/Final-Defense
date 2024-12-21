import { Star } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white py-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto text-center relative">
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-center mb-6">
            <Star className="h-12 w-12 text-yellow-300 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-100">
            Your Health, Our Priority
          </h1>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100">
            Find and order medicines from trusted pharmaceutical companies
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
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