interface CustomerInfoProps {
  displayName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export const CustomerInfo = ({
  displayName,
  email,
  phoneNumber,
  address,
}: CustomerInfoProps) => {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-2">Customer Information</h3>
      <p>Name: {displayName}</p>
      <p>Email: {email}</p>
      <p>Phone: {phoneNumber}</p>
      <p>Address: {address}</p>
    </div>
  );
};