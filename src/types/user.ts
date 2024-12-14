export interface UserData {
  uid: string;
  email: string;
  role: "regular" | "company";
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  companyName?: string;
  companyDescription?: string;
  companyLicense?: string;
  createdAt: Date;
  updatedAt: Date;
}