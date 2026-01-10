import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { safeApiCall } from '@/lib/safeApiCall';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    demo_url?: string;
  };
}

// Session ID for guest carts
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      let query = supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products:product_id (
            id,
            name,
            price,
            demo_url
          )
        `);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', getSessionId());
      }

      const { data, error } = await query;

      if (error) throw error;

      const cartItems = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.products,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items' },
        () => {
          fetchCart();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    setUpdating(true);
    try {
      // Check if item already exists
      const existingItem = items.find((item) => item.product_id === productId);

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('cart_items').insert({
          user_id: user?.id || null,
          session_id: user ? null : getSessionId(),
          product_id: productId,
          quantity,
        });

        if (error) throw error;
      }

      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart.',
      });

      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not add this item. Please try again.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart.',
      });

      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not remove this item. Please try again.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not update the quantity. Please try again.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    setUpdating(true);
    try {
      let query = supabase.from('cart_items').delete();

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', getSessionId());
      }

      const { error } = await query;

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Merge guest cart on login
  const mergeGuestCart = async () => {
    if (!user) return;

    const sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ user_id: user.id, session_id: null })
        .eq('session_id', sessionId);

      if (error) throw error;

      localStorage.removeItem('guest_session_id');
      await fetchCart();
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  };

  useEffect(() => {
    if (user) {
      mergeGuestCart();
    }
  }, [user]);

  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    loading,
    updating,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    refetch: fetchCart,
  };
}
