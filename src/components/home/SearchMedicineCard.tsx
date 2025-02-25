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
      className="p-3 sm:p-4 border border-green-100 rounded-lg hover:shadow-md transition-shadow bg-white text-left w-full"
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <img
          src={getImageUrl(medicine.image)}
          alt={medicine.name}
          className="w-14 h-14 object-contain rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div>
          <h4 className="font-medium text-gray-900 text-center sm:text-left">{medicine.name}</h4>
          <p className="text-sm text-gray-500 mt-0.5 text-center sm:text-left">BDT {medicine.price} per box</p>
        </div>
      </div>
    </button>
  );
};