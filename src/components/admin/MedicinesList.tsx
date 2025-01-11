import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { UserData } from "@/types/user";
import { CompanyMedicinesCard } from "./medicines/CompanyMedicinesCard";

export const MedicinesList = () => {
  // Fetch all medicines
  const { data: medicines, isLoading: medicinesLoading } = useQuery({
    queryKey: ["admin-medicines"],
    queryFn: async () => {
      const medicinesQuery = query(collection(db, "medicines"));
      const snapshot = await getDocs(medicinesQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Medicine[];
    },
  });

  // Fetch all companies
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const companiesQuery = query(
        collection(db, "users"),
        where("role", "==", "company")
      );
      const snapshot = await getDocs(companiesQuery);
      return snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as UserData[];
    },
  });

  if (medicinesLoading || companiesLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Group medicines by company
  const medicinesByCompany = medicines?.reduce((acc, medicine) => {
    if (!acc[medicine.companyId]) {
      acc[medicine.companyId] = [];
    }
    acc[medicine.companyId].push(medicine);
    return acc;
  }, {} as Record<string, Medicine[]>);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">All Medicines</h2>
      
      {companies?.map((company) => (
        <CompanyMedicinesCard
          key={company.uid}
          company={company}
          medicines={medicinesByCompany?.[company.uid] || []}
        />
      ))}
    </div>
  );
};