import { useQuery } from '@tanstack/react-query';
import { funnelApi } from '@/features/funnel/api/getVisibilityQuestions';

export function useVisibilityQuestionsQuery() {
  return useQuery({
    queryKey: ['funnel', 'visibility-questions'],
    queryFn: () => funnelApi.getVisibilityQuestions(),
  });
}
