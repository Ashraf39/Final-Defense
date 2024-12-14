import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { UserData } from "@/types/user";

export const useSearch = (searchQuery: string) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [companies, setCompanies] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      if (!searchQuery.trim()) {
        setMedicines([]);
        setCompanies([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchTerm = searchQuery.toLowerCase();

        // Search medicines
        const medicinesRef = collection(db, "medicines");
        const medicinesSnapshot = await getDocs(medicinesRef);
        const matchedMedicines = medicinesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Medicine))
          .filter(medicine => 
            medicine.name.toLowerCase().includes(searchTerm)
          );

        // Search companies
        const usersRef = collection(db, "users");
        const companiesQuery = query(usersRef, where("role", "==", "company"));
        const companiesSnapshot = await getDocs(companiesQuery);
        const matchedCompanies = companiesSnapshot.docs
          .map(doc => ({ uid: doc.id, ...doc.data() } as UserData))
          .filter(company => 
            company.companyName?.toLowerCase().includes(searchTerm)
          );

        setMedicines(matchedMedicines);
        setCompanies(matchedCompanies);
      } catch (error) {
        console.error("Error searching data:", error);
        setMedicines([]);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return { medicines, companies, isLoading };
};