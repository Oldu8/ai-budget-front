import { protectedGet } from '@/shared/api/protectedClient';

export interface VisibilityQuestion {
  visibility_tag: string;
  question_key: string;
  label: string;
  translation_key?: string;
  order?: number;
}

type VisibilityQuestionsResponse =
  | { data: VisibilityQuestion[] }
  | { questions?: VisibilityQuestion[] }
  | VisibilityQuestion[];

function normalizeQuestion(raw: Record<string, unknown>): VisibilityQuestion {
  return {
    visibility_tag: String(raw.visibility_tag ?? ''),
    question_key: String(raw.question_key ?? raw.visibility_tag ?? ''),
    label: String(raw.label ?? ''),
    translation_key: raw.translation_key ? String(raw.translation_key) : undefined,
    order: typeof raw.order === 'number' ? raw.order : undefined,
  };
}

function normalizeQuestions(response: VisibilityQuestionsResponse): VisibilityQuestion[] {
  let items: Record<string, unknown>[] = [];
  if (Array.isArray(response)) {
    items = response as unknown as Record<string, unknown>[];
  } else if ('data' in response && Array.isArray(response.data)) {
    items = response.data as unknown as Record<string, unknown>[];
  } else if ('questions' in response && Array.isArray(response.questions)) {
    items = response.questions as unknown as Record<string, unknown>[];
  }
  const questions = items.map(normalizeQuestion);
  return questions.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export const funnelApi = {
  async getVisibilityQuestions(): Promise<VisibilityQuestion[]> {
    const response = await protectedGet<VisibilityQuestionsResponse>(
      '/api/funnel/visibility-questions'
    );
    return normalizeQuestions(response);
  },
};
