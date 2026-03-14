import { protectedGet } from '@/shared/api/protectedClient';

export interface VisibilityQuestion {
  visibility_tag: string;
  question?: string;
  [key: string]: unknown;
}

export type VisibilityQuestionsResponse = VisibilityQuestion[] | { questions?: VisibilityQuestion[] };

export const funnelApi = {
  getVisibilityQuestions() {
    return protectedGet<VisibilityQuestionsResponse>('/api/funnel/visibility-questions');
  },
};
