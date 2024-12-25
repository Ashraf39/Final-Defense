import { Link } from "react-router-dom";
import { Medicine } from "@/types/medicine";
import { UserData } from "@/types/user";

interface SearchResultsProps {
  medicines: Medicine[];
  companies: UserData[];
  isLoading: boolean;
}

export const SearchResults = ({ medicines, companies, isLoading }: SearchResultsProps) => {
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl || imageUrl === "") return "/placeholder.svg";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return imageUrl;
    return `/placeholder.svg`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 mt-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (medicines.length === 0 && companies.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 mt-4 space-y-6">
      {companies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Link
                key={company.uid}
                to={`/company/${company.uid}`}
                className="p-4 border border-green-100 rounded-lg hover:shadow-md transition-shadow bg-white"
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {medicines.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Medicines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicines.map((medicine) => (
              <Link
                key={medicine.id}
                to={`/medicine/${medicine.id}`}
                className="p-4 border border-green-100 rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(medicine.image)}
                    alt={medicine.name}
                    className="w-12 h-12 object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                    <p className="text-sm text-gray-500">BDT {medicine.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
