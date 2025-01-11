import { Medicine } from "@/types/medicine";
import { UserData } from "@/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MedicinesTable } from "./MedicinesTable";

interface CompanyMedicinesCardProps {
  company: UserData;
  medicines: Medicine[];
}

export const CompanyMedicinesCard = ({ company, medicines }: CompanyMedicinesCardProps) => {
  return (
    <Card>
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
        <MedicinesTable medicines={medicines} />
      </CardContent>
    </Card>
  );
};