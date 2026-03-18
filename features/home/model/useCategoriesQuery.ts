import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/features/home/api/getCategories';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['home', 'categories'],
    queryFn: getCategories,
  });
}
