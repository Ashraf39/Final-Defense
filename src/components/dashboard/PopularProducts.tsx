import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Medicine } from "@/types/medicine";
import { useState } from "react";
import { MedicineDetailsDialog } from "./MedicineDetailsDialog";

interface PopularProductsProps {
  products: Medicine[];
}

export const PopularProducts = ({ products }: PopularProductsProps) => {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const handleViewMedicine = (medicine: Medicine) => {
    // Add missing properties if they don't exist
    const completeProduct: Medicine = {
      ...medicine,
      image: medicine.image || "/placeholder.svg",
      createdAt: medicine.createdAt || new Date(),
      updatedAt: medicine.updatedAt || new Date(),
    };
    setSelectedMedicine(completeProduct);
  };

  const handleCloseDialog = () => {
    setSelectedMedicine(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Popular Products</CardTitle>
          <CardDescription>Top 3 most sold medicines</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales || 0} units sold
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewMedicine(product)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No sales data available</p>
          )}
        </CardContent>
      </Card>

      <MedicineDetailsDialog 
        medicine={selectedMedicine}
        isOpen={!!selectedMedicine}
        onClose={handleCloseDialog}
      />
    </>
  );
};