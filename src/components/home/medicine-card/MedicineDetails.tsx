interface MedicineDetailsProps {
  name: string;
  description: string;
  price: number;
}

export const MedicineDetails = ({ name, description, price }: MedicineDetailsProps) => {
  return (
    <>
      <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 truncate text-gray-800">
        {name}
      </h3>
      <div className="min-h-[2.5rem] sm:min-h-[3rem] mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-center mb-3 sm:mb-4">
        <span className="text-base sm:text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
          BDT {price}
        </span>
      </div>
    </>
  );
};