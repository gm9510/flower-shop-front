import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Eye, 
  Package, 
  MessageCircle 
} from "lucide-react";

interface QuickAction {
  title: string;
  description?: string;
  icon: React.ReactNode;
  variant: "default" | "secondary" | "outline" | "destructive";
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    title: "Add New Product",
    description: "Add a new flower to inventory",
    icon: <Plus className="h-4 w-4" />,
    variant: "default",
    onClick: () => console.log("Add product")
  },
  {
    title: "View All Orders",
    description: "Manage customer orders",
    icon: <Eye className="h-4 w-4" />,
    variant: "secondary",
    onClick: () => console.log("View orders")
  },
  {
    title: "Manage Inventory",
    description: "Update stock levels",
    icon: <Package className="h-4 w-4" />,
    variant: "outline",
    onClick: () => console.log("Manage inventory")
  },
  {
    title: "Customer Support",
    description: "Handle customer inquiries",
    icon: <MessageCircle className="h-4 w-4" />,
    variant: "outline",
    onClick: () => console.log("Customer support")
  }
];

export default function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full h-auto p-4 justify-start"
            onClick={action.onClick}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                {action.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </div>
                )}
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}