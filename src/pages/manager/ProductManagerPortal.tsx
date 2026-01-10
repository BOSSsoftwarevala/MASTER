import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, Layers, Star, CreditCard, Plus, Eye, Activity, TrendingUp } from 'lucide-react';

export default function ProductManagerPortal() {
  const navigate = useNavigate();

  const widgets = [
    { title: 'Total Products', value: 24, icon: Package, color: 'text-blue-500', change: '+3 this week' },
    { title: 'Categories', value: 8, icon: Layers, color: 'text-blue-600', change: '2 active' },
    { title: 'Features', value: 47, icon: Star, color: 'text-blue-400', change: '+5 new' },
    { title: 'Plan Mappings', value: 12, icon: CreditCard, color: 'text-blue-700', change: 'All active' },
  ];

  return (
    <ManagerLayout role="product">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Product Manager</h1>
          <p className="text-muted-foreground">Manage software products, categories, features, and pricing</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {widgets.map((widget) => (
            <Card key={widget.title} className="border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <widget.icon className={`h-4 w-4 ${widget.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{widget.value}</div>
                <p className="text-xs text-muted-foreground">{widget.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/manager/product/products')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/product/categories')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <Layers className="h-4 w-4 mr-2" />
              Manage Categories
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/product/features')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <Star className="h-4 w-4 mr-2" />
              View Features
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/product/pricing')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Plan Mapping
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">New product "Enterprise Suite" added</span>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Feature "Dark Mode" enabled for 3 products</span>
                </div>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Pricing updated for "Starter Plan"</span>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
