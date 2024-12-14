export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  stock: number;
}