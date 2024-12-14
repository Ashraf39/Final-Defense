import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { UserData } from "@/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <Card key={company.uid}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <img
                src={company.companyLogo || "/placeholder.svg"}
                alt={company.companyName}
                className="w-8 h-8 rounded-full"
              />
              {company.companyName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesByCompany?.[company.uid]?.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.description}</TableCell>
                    <TableCell>${medicine.price}</TableCell>
                    <TableCell>{medicine.stock}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No medicines found for this company
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
