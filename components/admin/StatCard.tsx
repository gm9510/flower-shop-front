import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "bg-blue-500",
  description
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${iconColor} rounded-md flex items-center justify-center`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900">
                  {value}
                </div>
              </dd>
              {description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {description}
                </div>
              )}
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}