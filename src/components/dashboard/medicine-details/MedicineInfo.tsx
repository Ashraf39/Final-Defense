interface MedicineInfoProps {
  name: string;
  price: number;
  description: string;
  stock: number;
}

export const MedicineInfo = ({ name, price, description, stock }: MedicineInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-xl font-bold text-primary">BDT {price} per box</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Stock</h3>
        <p className="text-gray-600">{stock} box{stock === 1 ? '' : 'es'} available</p>
      </div>
    </div>
  );
};