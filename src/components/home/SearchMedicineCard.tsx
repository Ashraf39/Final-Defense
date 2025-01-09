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
      className="p-10 border border-green-100 rounded-lg hover:shadow-md transition-shadow bg-white text-left w-full"
    >
      <div className="flex items-center gap-8">
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
          <h4 className="font-medium text-gray-900">{medicine.name}</h4>
          <p className="text-sm text-gray-500 mt-2">BDT {medicine.price}</p>
        </div>
      </div>
    </button>
  );
};