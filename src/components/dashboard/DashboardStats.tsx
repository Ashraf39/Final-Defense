import { Package, TrendingUp, Users, ClipboardList } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface Stat {
  title: string;
  value: string;
  description: string;
  icon: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

const iconMap = {
  Package,
  TrendingUp,
  Users,
  ClipboardList
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];
        return (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={Icon}
          />
        );
      })}
    </div>
  );
};