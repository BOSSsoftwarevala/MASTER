import { useNavigate } from 'react-router-dom';
import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Clock, CheckCircle, AlertTriangle, Eye, Truck, DollarSign, Plus, ShoppingCart } from 'lucide-react';

const orders = [
  { 
    id: 'ORD-2024-001', 
    projectId: 'PRJ-10001',
    client: 'ABC School', 
    product: 'School Management Pro', 
    amount: 45000, 
    commission: 13500,
    status: 'pending', 
    paymentStatus: 'full',
    progress: 20,
    orderedAt: '2024-01-20 10:30',
    deliveryDeadline: '2024-01-20 12:30'
  },
  { 
    id: 'ORD-2024-002', 
    projectId: 'PRJ-10002',
    client: 'XYZ Coaching', 
    product: 'Coaching Institute Suite', 
    amount: 35000, 
    commission: 10500,
    status: 'processing', 
    paymentStatus: 'partial',
    progress: 60,
    orderedAt: '2024-01-20 09:15',
    deliveryDeadline: '2024-01-20 11:15'
  },
  { 
    id: 'ORD-2024-003', 
    projectId: 'PRJ-10003',
    client: 'City Library', 
    product: 'Library Manager', 
    amount: 25000, 
    commission: 7500,
    status: 'delivered', 
    paymentStatus: 'full',
    progress: 100,
    orderedAt: '2024-01-19 14:00',
    deliveryDeadline: '2024-01-19 16:00'
  },
  { 
    id: 'ORD-2024-004', 
    projectId: 'PRJ-10004',
    client: 'Modern College', 
    product: 'College ERP', 
    amount: 75000, 
    commission: 22500,
    status: 'delivered', 
    paymentStatus: 'full',
    progress: 100,
    orderedAt: '2024-01-18 11:00',
    deliveryDeadline: '2024-01-18 13:00'
  },
];

const statusConfig = {
  pending: { color: 'bg-amber-500', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-500', icon: Truck, label: 'Processing' },
  delivered: { color: 'bg-emerald-500', icon: CheckCircle, label: 'Delivered' },
  delayed: { color: 'bg-red-500', icon: AlertTriangle, label: 'Delayed' },
};

const paymentConfig = {
  full: { color: 'bg-emerald-500', label: 'Paid' },
  partial: { color: 'bg-amber-500', label: 'Partial' },
  pending: { color: 'bg-red-500', label: 'Unpaid' },
};

export default function FranchiseOrdersPage() {
  const navigate = useNavigate();
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const totalCommission = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.commission, 0);

  const handleViewOrder = (order: typeof orders[0]) => {
    navigate(`/portal/franchise/order-status?orderId=${order.id}&projectId=${order.projectId}&product=${encodeURIComponent(order.product)}&plan=yearly&amount=${order.amount}`);
  };

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Order Requests
            </h1>
            <p className="text-muted-foreground mt-1">Track and manage order deliveries</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-amber-500 border-amber-500 gap-1">
              <Clock className="h-3 w-3" />
              {pendingOrders} Pending
            </Badge>
            <Button 
              onClick={() => navigate('/portal/franchise/place-order')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Place Order
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting delivery</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Delivered Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                ₹{orders.reduce((acc, o) => acc + o.amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Commission Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-500">₹{totalCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">30% auto-deducted</p>
            </CardContent>
          </Card>
        </div>

        {/* Delivery SLA Notice */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-500">2-Hour Delivery SLA</h4>
                <p className="text-sm text-muted-foreground">
                  All standard software orders must be delivered within 2 hours. Commission is auto-credited upon successful delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-500" />
              Recent Orders
            </CardTitle>
            <CardDescription>Track order status and delivery • Click to view live progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const config = statusConfig[order.status as keyof typeof statusConfig];
                  const payConfig = paymentConfig[order.paymentStatus as keyof typeof paymentConfig];
                  const StatusIcon = config.icon;
                  return (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewOrder(order)}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{order.projectId}</TableCell>
                      <TableCell>{order.client}</TableCell>
                      <TableCell className="text-muted-foreground">{order.product}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono">{order.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{order.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-emerald-500 font-medium">₹{order.commission.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={payConfig.color}>{payConfig.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${config.color} gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
