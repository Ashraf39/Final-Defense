interface MedicineImageProps {
  image: string;
  name: string;
}

export const MedicineImage = ({ image, name }: MedicineImageProps) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-[300px] object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
    </div>
  );
};