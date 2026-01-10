import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { safeApiCall } from '@/lib/safeApiCall';

interface FavoriteItem {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    price: number;
    demo_url?: string;
  };
}

export function useFavorites() {
  const { user } = useAuth();
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          products:product_id (
            id,
            name,
            price,
            demo_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteItems = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product: item.products,
      }));

      setItems(favoriteItems);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addToFavorites = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to add favorites.',
      });
      return false;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - already favorited
          toast({
            title: 'Already in favorites',
            description: 'This item is already in your favorites.',
          });
          return false;
        }
        throw error;
      }

      toast({
        title: 'Added to favorites',
        description: 'Item has been added to your wishlist.',
      });

      await fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not add this item. Please try again.',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return false;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: 'Removed from favorites',
        description: 'Item has been removed from your wishlist.',
      });

      await fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not remove this item. Please try again.',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    const isFavorited = items.some((item) => item.product_id === productId);
    if (isFavorited) {
      return removeFromFavorites(productId);
    } else {
      return addToFavorites(productId);
    }
  };

  const isFavorite = (productId: string) => {
    return items.some((item) => item.product_id === productId);
  };

  return {
    items,
    loading,
    updating,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
