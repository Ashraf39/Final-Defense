import { Link } from "react-router-dom";
import { UserData } from "@/types/user";

interface CompanySectionProps {
  companies: UserData[];
}

export const CompanySection = ({ companies }: CompanySectionProps) => {
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Companies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {companies.map((company) => (
          <Link
            key={company.uid}
            to={`/company/${company.uid}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-green-100 group"
          >
            <img
              src={company.companyLogo || "/placeholder.svg"}
              alt={`${company.companyName} Logo`}
              className="w-16 h-16 mx-auto mb-3 object-contain"
            />
            <h3 className="text-lg font-medium text-center text-gray-800 group-hover:text-green-600">
              {company.companyName || "Company Name"}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};