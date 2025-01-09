import { Medicine } from "@/types/medicine";
import { getImageUrl } from "@/lib/utils";

interface SearchMedicineCardProps {
  medicine: Medicine;
  onClick: () => void;
}

export const SearchMedicineCard = ({ medicine, onClick }: SearchMedicineCardProps) => {
  return (
    <button
      onClick={onClick}
      className="p-4 sm:p-6 border border-green-100 rounded-lg hover:shadow-md transition-shadow bg-white text-left w-full"
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <img
          src={getImageUrl(medicine.image)}
          alt={medicine.name}
          className="w-16 h-16 object-contain rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div>
          <h4 className="font-medium text-gray-900 text-center sm:text-left">{medicine.name}</h4>
          <p className="text-sm text-gray-500 mt-1 text-center sm:text-left">BDT {medicine.price}</p>
        </div>
      </div>
    </button>
  );
};