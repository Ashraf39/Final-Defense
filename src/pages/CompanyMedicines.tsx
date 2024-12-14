import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const CompanyMedicines = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [medicines] = useState([
    {
      id: 1,
      name: "Medicine 1",
      description: "Description for Medicine 1",
      price: 99.99,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Medicine 2",
      description: "Description for Medicine 2",
      price: 149.99,
      image: "/placeholder.svg",
    },
    // Add more medicines as needed
  ]);

  const handleLike = (medicineId: number) => {
    toast({
      title: "Added to favorites",
      description: "Medicine has been added to your favorites",
    });
  };

  const handleAddToCart = (medicineId: number) => {
    toast({
      title: "Added to cart",
      description: "Medicine has been added to your cart",
    });
  };

  const handleBuy = (medicineId: number) => {
    toast({
      title: "Proceeding to checkout",
      description: "Redirecting to payment page",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Medicines</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className="flex flex-col">
            <CardContent className="p-4">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
              <p className="text-gray-600 mb-2">{medicine.description}</p>
              <p className="text-primary font-bold">${medicine.price}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 mt-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(medicine.id)}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddToCart(medicine.id)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleBuy(medicine.id)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Buy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};