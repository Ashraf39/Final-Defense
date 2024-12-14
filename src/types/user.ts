export interface UserData {
  uid: string;
  email: string;
  role: "regular" | "company" | "admin";
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  companyName?: string;
  companyDescription?: string;
  companyLicense?: string;
  companyLogo?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}