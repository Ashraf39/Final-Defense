import { Medicine } from "@/types/medicine";
import { UserData } from "@/types/user";
import { useState } from "react";
import { CompanyMedicinesDialog } from "./CompanyMedicinesDialog";
import { MedicineDetailsDialog } from "../dashboard/MedicineDetailsDialog";
import { CompanyCard } from "./CompanyCard";
import { SearchMedicineCard } from "./SearchMedicineCard";
import { SearchLoadingState } from "./SearchLoadingState";

interface SearchResultsProps {
  medicines: Medicine[];
  companies: UserData[];
  isLoading: boolean;
}

export const SearchResults = ({ medicines, companies, isLoading }: SearchResultsProps) => {
  const [selectedCompany, setSelectedCompany] = useState<UserData | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  if (isLoading) {
    return <SearchLoadingState />;
  }

  if (medicines.length === 0 && companies.length === 0) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 mt-4 space-y-8 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        {companies.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <CompanyCard
                  key={company.uid}
                  company={company}
                  onClick={() => setSelectedCompany(company)}
                />
              ))}
            </div>
          </div>
        )}

        {medicines.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Medicines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-2">
              {medicines.map((medicine) => (
                <SearchMedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onClick={() => setSelectedMedicine(medicine)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CompanyMedicinesDialog
        companyId={selectedCompany?.uid || null}
        companyName={selectedCompany?.companyName || ""}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
      />

      <MedicineDetailsDialog
        medicine={selectedMedicine}
        isOpen={!!selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
      />
    </>
  );
};