interface MedicineDetailsProps {
  name: string;
  description: string;
  price: number;
}

export const MedicineDetails = ({ name, description, price }: MedicineDetailsProps) => {
  return (
    <>
      <h3 className="text-sm font-medium mb-1 truncate text-gray-800">
        {name}
      </h3>
      <div className="min-h-[2rem] mb-2">
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-center mb-2">
        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          BDT {price}
        </span>
      </div>
    </>
  );
};