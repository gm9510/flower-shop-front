import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data type for demo purposes
interface OrderSummary {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date?: string;
}

interface OrdersTableProps {
  orders?: OrderSummary[];
  title?: string;
  showActions?: boolean;
}

const mockOrders: OrderSummary[] = [
  { 
    id: '#1001', 
    customer: 'Sarah Johnson', 
    amount: '$89.99', 
    status: 'Processing',
    date: '2024-11-01'
  },
  { 
    id: '#1002', 
    customer: 'Mike Chen', 
    amount: '$124.50', 
    status: 'Shipped',
    date: '2024-10-31'
  },
  { 
    id: '#1003', 
    customer: 'Emma Davis', 
    amount: '$67.25', 
    status: 'Delivered',
    date: '2024-10-30'
  },
  { 
    id: '#1004', 
    customer: 'Alex Brown', 
    amount: '$156.75', 
    status: 'Processing',
    date: '2024-10-30'
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'default'; // Green
    case 'shipped':
      return 'secondary'; // Blue
    case 'processing':
      return 'outline'; // Yellow/Orange
    case 'cancelled':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export default function OrdersTable({
  orders = mockOrders,
  title = "Recent Orders",
  showActions = false
}: OrdersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center w-[120px]">Status</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <TableCell className="font-medium text-gray-900">
                  {order.id}
                </TableCell>
                <TableCell className="text-gray-700">
                  {order.customer}
                </TableCell>
                <TableCell className="text-right font-semibold text-gray-900">
                  {order.amount}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={getStatusVariant(order.status)}
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View order:', order.id);
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit order:', order.id);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Show more link */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all orders →
        </button>
      </div>
    </div>
  );
}