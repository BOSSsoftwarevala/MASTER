import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
}

export function useProducts(options?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false);

      if (options?.featured) {
        query = query.eq('is_featured', true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // If categoryId is provided, filter by category
      if (options?.categoryId && data) {
        const { data: productCategories, error: pcError } = await supabase
          .from('product_categories')
          .select('product_id')
          .eq('category_id', options.categoryId);

        if (pcError) throw pcError;

        const productIds = new Set(
          productCategories?.map((pc) => pc.product_id) || []
        );
        setProducts(data.filter((p) => productIds.has(p.id)));
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [options?.categoryId, options?.featured, options?.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;

      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, refetch: fetchProduct };
}

export function useTopSellingProducts(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

export function useNewLaunchProducts(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching new launch products:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

export function useUpcomingProducts(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'coming_soon')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching upcoming products:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}
