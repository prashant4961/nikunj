import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, apiErrorMessage } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { toast } from '@/store/toast';
import type { Product } from '@/types';

export function useWishlist() {
  const token = useAuth((s) => s.token);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get<{ items: Product[] }>('/wishlist')).data.items,
    enabled: Boolean(token),
  });

  const ids = new Set((query.data ?? []).map((p) => p.id));

  const toggle = useMutation({
    mutationFn: async (product: Product) => {
      if (ids.has(product.id)) {
        await api.delete(`/wishlist/${product.id}`);
        return 'removed' as const;
      }
      await api.post('/wishlist', { productId: product.id });
      return 'added' as const;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(result === 'added' ? 'Saved to your wishlist' : 'Removed from wishlist');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update your wishlist')),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isSaved: (productId: number) => ids.has(productId),
    toggle: toggle.mutate,
    isToggling: toggle.isPending,
  };
}
