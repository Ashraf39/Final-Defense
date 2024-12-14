import { Package, TrendingUp, Users, ClipboardList } from "lucide-react";
import { StatsCard } from "./StatsCard";

export const DashboardStats = () => {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      description: "Active medicines in catalog",
      icon: Package,
    },
    {
      title: "Monthly Sales",
      value: "$12,345",
      description: "Revenue this month",
      icon: TrendingUp,
    },
    {
      title: "Active Customers",
      value: "1,234",
      description: "Customers this month",
      icon: Users,
    },
    {
      title: "Pending Orders",
      value: "12",
      description: "Orders to be processed",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};