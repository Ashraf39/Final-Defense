import { Medicine } from "@/types/medicine";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MedicinesTableProps {
  medicines: Medicine[];
}

export const MedicinesTable = ({ medicines }: MedicinesTableProps) => {
  return (
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
        {medicines?.map((medicine) => (
          <TableRow key={medicine.id}>
            <TableCell className="font-medium">{medicine.name}</TableCell>
            <TableCell>{medicine.description}</TableCell>
            <TableCell>BDT {medicine.price}</TableCell>
            <TableCell>{medicine.stock} box{medicine.stock === 1 ? '' : 'es'}</TableCell>
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
  );
};