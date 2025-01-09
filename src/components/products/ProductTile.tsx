import { Medicine } from "@/types/medicine";
import { cn } from "@/lib/utils";

interface ProductTileProps {
  medicine: Medicine;
  onClick?: () => void;
  className?: string;
}

export const ProductTile = ({ medicine, onClick, className }: ProductTileProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "max-w-[150px] p-3 rounded-xl bg-white border border-primary-light",
        "transform transition-all duration-300 hover:scale-105 hover:-translate-y-1",
        "shadow-sm hover:shadow-md cursor-pointer",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={medicine.image || "/placeholder.svg"}
            alt={medicine.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        
        <h3 className="text-sm font-medium text-center line-clamp-2">
          {medicine.name}
        </h3>
        
        <p className="text-xs text-gray-600 text-center line-clamp-2">
          {medicine.description}
        </p>
        
        <span className="text-sm font-bold text-primary">
          BDT {medicine.price}
        </span>
      </div>
    </div>
  );
};