import { useQuery } from '@tanstack/react-query';
import { visibilityTagsApi } from '@/features/funnel/api/getVisibilityTags';
import type { PreferenceAnswers } from '@/features/funnel/types';
import type { VisibilityQuestion } from '@/features/funnel/api/getVisibilityQuestions';

/**
 * Maps visibility tags (from API) to PreferenceAnswers keyed by question_key.
 * Requires questions to map visibility_tag -> question_key.
 */
export function mapVisibilityTagsToAnswers(
  tags: { visibility_tag: string; enabled: boolean }[],
  questions: VisibilityQuestion[]
): PreferenceAnswers {
  const tagMap = new Map(tags.map((t) => [t.visibility_tag, t.enabled]));
  return questions.reduce<PreferenceAnswers>((acc, q) => {
    acc[q.question_key] = tagMap.get(q.visibility_tag) ?? false;
    return acc;
  }, {});
}

export function useVisibilityTagsQuery() {
  return useQuery({
    queryKey: ['visibility-tags'],
    queryFn: () => visibilityTagsApi.getVisibilityTags(),
  });
}
