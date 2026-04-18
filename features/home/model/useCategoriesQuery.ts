import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { getCategories } from '@/features/home/api/getCategories';

export function useCategoriesQuery() {
  const { status } = useAuthContext();
  return useQuery({
    queryKey: ['home', 'categories'],
    queryFn: getCategories,
    enabled: status === 'authenticated',
  });
}
