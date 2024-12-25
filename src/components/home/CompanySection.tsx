import { Building2, Star } from "lucide-react";
import { UserData } from "@/types/user";
import { useState } from "react";
import { CompanyMedicinesDialog } from "./CompanyMedicinesDialog";

interface CompanySectionProps {
  companies: UserData[];
}

export const CompanySection = ({ companies }: CompanySectionProps) => {
  const [selectedCompany, setSelectedCompany] = useState<UserData | null>(null);

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Building2 className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Featured Companies</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {companies.map((company) => (
            <button
              key={company.uid}
              onClick={() => setSelectedCompany(company)}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-green-100 hover:border-green-200 hover:-translate-y-1"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              
              <img
                src={company.companyLogo || "/placeholder.svg"}
                alt={`${company.companyName} Logo`}
                className="w-20 h-20 mx-auto mb-4 object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              
              <h3 className="text-lg font-medium text-center text-gray-800 group-hover:text-green-600 transition-colors">
                {company.companyName || "Company Name"}
              </h3>
            </button>
          ))}
        </div>
      </section>

      <CompanyMedicinesDialog
        companyId={selectedCompany?.uid || null}
        companyName={selectedCompany?.companyName || ""}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
      />
    </>
  );
};