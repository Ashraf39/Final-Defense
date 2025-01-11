import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CompanyInfo {
  companyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  companyLicense: string;
}

export const fetchCompanyInfo = async (companyId: string): Promise<CompanyInfo | null> => {
  try {
    const companyDoc = await getDoc(doc(db, "users", companyId));
    if (companyDoc.exists()) {
      const data = companyDoc.data();
      return {
        companyName: data.companyName || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        companyLicense: data.companyLicense || ""
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
};