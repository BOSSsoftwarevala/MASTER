import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, Layers, Star, Plus, Eye, CreditCard, Sparkles, Zap } from 'lucide-react';
import { useProducts, useCategories, useFeatures } from '@/hooks/useProductDemoData';

export default function ProductManagerDashboard() {
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: features } = useFeatures();

  const widgets = [
    { title: 'Total Products', value: products?.length || 0, icon: Package, color: 'text-blue-500' },
    { title: 'Categories', value: categories?.length || 0, icon: Layers, color: 'text-blue-600' },
    { title: 'Features', value: features?.length || 0, icon: Star, color: 'text-blue-400' },
    { title: 'Plan Mappings', value: '-', icon: CreditCard, color: 'text-blue-700' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Product Manager</h1>
            <p className="text-muted-foreground">Manage products, categories, features, and pricing visibility</p>
          </div>
          {/* VALA AI Entry Point */}
          <Button 
            onClick={() => navigate('/dashboard/boss/vala')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Zap className="h-4 w-4 mr-2" />
            AI Build / AI Assist
          </Button>
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
              onClick={() => navigate('/dashboard/product/products/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/product/products')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Products
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/product/pricing/mapping')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Plan Mapping
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
