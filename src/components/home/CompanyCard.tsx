import { UserData } from "@/types/user";
import { getImageUrl } from "@/lib/utils";

interface CompanyCardProps {
  company: UserData;
  onClick: () => void;
}

export const CompanyCard = ({ company, onClick }: CompanyCardProps) => {
  return (
    <button
      onClick={onClick}
      className="p-4 border border-green-100 rounded-lg hover:shadow-md transition-shadow bg-white text-left w-full"
    >
      <div className="flex items-center gap-3">
        <img
          src={getImageUrl(company.companyLogo)}
          alt={company.companyName}
          className="w-12 h-12 object-contain rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div>
          <h4 className="font-medium text-gray-900">{company.companyName}</h4>
          <p className="text-sm text-gray-500">Company</p>
        </div>
      </div>
    </button>
  );
};