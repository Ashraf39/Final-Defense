import { getImageUrl } from "@/lib/utils";

interface MedicineImageProps {
  image: string | undefined;
  name: string;
}

export const MedicineImage = ({ image, name }: MedicineImageProps) => {
  return (
    <div className="relative overflow-hidden">
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-[120px] sm:h-[160px] object-contain rounded-t-xl p-2 sm:p-3 bg-gradient-to-b from-[#F2FCE2] to-white transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
    </div>
  );
};