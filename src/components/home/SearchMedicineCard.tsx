import { Medicine } from "@/types/medicine";
import { ProductTile } from "@/components/products/ProductTile";

interface SearchMedicineCardProps {
  medicine: Medicine;
  onClick: () => void;
}

export const SearchMedicineCard = ({ medicine, onClick }: SearchMedicineCardProps) => {
  return <ProductTile medicine={medicine} onClick={onClick} />;
};