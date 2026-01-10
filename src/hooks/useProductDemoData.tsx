import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Products
export const useProducts = (status?: string) => {
  return useQuery({
    queryKey: ['products', status],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: {
      name: string;
      slug: string;
      short_description?: string;
      full_description?: string;
      category_id?: string;
      status?: string;
      base_price?: number;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create product: ' + error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update product: ' + error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete product: ' + error.message);
    },
  });
};

// Product Features
export const useProductFeatures = (productId?: string) => {
  return useQuery({
    queryKey: ['product-features', productId],
    queryFn: async () => {
      let query = supabase
        .from('product_features')
        .select('*, products(name)')
        .order('sort_order', { ascending: true });
      
      if (productId) {
        query = query.eq('product_id', productId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

// All Features (alias for ProductFeatures without filter)
export const useFeatures = () => {
  return useQuery({
    queryKey: ['all-features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_features')
        .select('*, products(name)')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProductFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feature: {
      product_id: string;
      feature_name: string;
      feature_description?: string;
      is_highlighted?: boolean;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('product_features')
        .insert(feature)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-features'] });
      toast.success('Feature added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add feature: ' + error.message);
    },
  });
};

export const useDeleteProductFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_features')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-features'] });
      toast.success('Feature deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete feature: ' + error.message);
    },
  });
};

// Categories (reusing existing table)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

// Demos
export const useDemos = (status?: string) => {
  return useQuery({
    queryKey: ['demos', status],
    queryFn: async () => {
      let query = supabase
        .from('demos')
        .select('*, products(name)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status === 'active') {
        query = query.eq('status', 'active').gt('expires_at', new Date().toISOString());
      } else if (status === 'expired') {
        query = query.or(`status.eq.expired,expires_at.lt.${new Date().toISOString()}`);
      } else if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useDemo = (id: string) => {
  return useQuery({
    queryKey: ['demo', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demos')
        .select('*, products(name)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateDemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (demo: {
      product_id: string;
      user_email?: string;
      user_name?: string;
      expires_at: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('demos')
        .insert(demo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demos'] });
      toast.success('Demo created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create demo: ' + error.message);
    },
  });
};

export const useUpdateDemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from('demos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demos'] });
      toast.success('Demo updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update demo: ' + error.message);
    },
  });
};

export const useExtendDemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newExpiresAt }: { id: string; newExpiresAt: string }) => {
      const { data: demo, error: fetchError } = await supabase
        .from('demos')
        .select('extended_count, max_extensions')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      if ((demo?.extended_count || 0) >= (demo?.max_extensions || 1)) {
        throw new Error('Maximum extensions reached');
      }
      
      const { data, error } = await supabase
        .from('demos')
        .update({ 
          expires_at: newExpiresAt,
          extended_count: (demo?.extended_count || 0) + 1,
          status: 'active'
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demos'] });
      toast.success('Demo extended successfully');
    },
    onError: (error) => {
      toast.error('Failed to extend demo: ' + error.message);
    },
  });
};

// Demo Requests
export const useDemoRequests = (status?: string) => {
  return useQuery({
    queryKey: ['demo-requests', status],
    queryFn: async () => {
      let query = supabase
        .from('demo_requests')
        .select('*, products(name)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateDemoRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from('demo_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-requests'] });
      toast.success('Request updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update request: ' + error.message);
    },
  });
};

// Plan Mappings
export const usePlanMappings = () => {
  return useQuery({
    queryKey: ['plan-mappings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plan_mappings')
        .select('*, products(name), finance_plans(name, price)')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePlanMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mapping: {
      product_id: string;
      plan_id: string;
      is_visible?: boolean;
      visibility_regions?: string[];
    }) => {
      const { data, error } = await supabase
        .from('plan_mappings')
        .insert(mapping)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-mappings'] });
      toast.success('Plan mapping created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create mapping: ' + error.message);
    },
  });
};

export const useUpdatePlanMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from('plan_mappings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-mappings'] });
      toast.success('Plan mapping updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update mapping: ' + error.message);
    },
  });
};

export const useDeletePlanMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plan_mappings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-mappings'] });
      toast.success('Plan mapping deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete mapping: ' + error.message);
    },
  });
};

// Demo Usage
export const useDemoUsage = (demoId?: string) => {
  return useQuery({
    queryKey: ['demo-usage', demoId],
    queryFn: async () => {
      let query = supabase
        .from('demo_usage')
        .select('*, demos(user_email, products(name))')
        .order('session_date', { ascending: false });
      
      if (demoId) {
        query = query.eq('demo_id', demoId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

// Conversions
export const useConversions = () => {
  return useQuery({
    queryKey: ['conversions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversions')
        .select('*, demos(user_email), products(name), finance_plans(name)')
        .order('converted_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateConversion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversion: {
      demo_id: string;
      product_id: string;
      user_email?: string;
      plan_id?: string;
      conversion_value?: number;
    }) => {
      // First update the demo status
      await supabase
        .from('demos')
        .update({ status: 'converted' })
        .eq('id', conversion.demo_id);
      
      const { data, error } = await supabase
        .from('conversions')
        .insert(conversion)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions'] });
      queryClient.invalidateQueries({ queryKey: ['demos'] });
      toast.success('Conversion recorded successfully');
    },
    onError: (error) => {
      toast.error('Failed to record conversion: ' + error.message);
    },
  });
};

// Stats for dashboard
export const useProductDemoStats = () => {
  return useQuery({
    queryKey: ['product-demo-stats'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      
      const [products, activeDemos, expiringToday, conversions] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('demos').select('id', { count: 'exact' }).eq('status', 'active').gt('expires_at', now),
        supabase.from('demos').select('id', { count: 'exact' }).lte('expires_at', today + 'T23:59:59Z').gte('expires_at', today + 'T00:00:00Z'),
        supabase.from('conversions').select('id', { count: 'exact' }),
      ]);
      
      const totalDemos = await supabase.from('demos').select('id', { count: 'exact' }).eq('is_deleted', false);
      const conversionRate = totalDemos.count && conversions.count 
        ? ((conversions.count / totalDemos.count) * 100).toFixed(1)
        : '0';
      
      return {
        totalProducts: products.count || 0,
        activeDemos: activeDemos.count || 0,
        expiringToday: expiringToday.count || 0,
        conversionRate: conversionRate + '%',
        totalConversions: conversions.count || 0,
      };
    },
  });
};

// Finance Plans (for plan mapping)
export const useFinancePlans = () => {
  return useQuery({
    queryKey: ['finance-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finance_plans')
        .select('*')
        .eq('is_deleted', false)
        .eq('is_active', true)
        .order('price', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};
