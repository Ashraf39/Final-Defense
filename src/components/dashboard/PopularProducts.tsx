import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Medicine } from "@/types/dashboard";
import { useNavigate } from "react-router-dom";

interface PopularProductsProps {
  products: Medicine[];
}

export const PopularProducts = ({ products }: PopularProductsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Products</CardTitle>
        <CardDescription>Most sold medicines</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales || 0} sales
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate(`/medicine/${product.id}`)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No products data available</p>
        )}
      </CardContent>
    </Card>
  );
};