import { protectedGet } from '@/shared/api/protectedClient';

export interface VisibilityTag {
  visibility_tag: string;
  enabled: boolean;
}

type VisibilityTagsResponse =
  | { data: VisibilityTag[] }
  | { tags?: VisibilityTag[] }
  | VisibilityTag[];

function normalizeTags(response: VisibilityTagsResponse): VisibilityTag[] {
  if (Array.isArray(response)) return response;
  if ('data' in response && Array.isArray(response.data)) return response.data;
  if ('tags' in response && Array.isArray(response.tags)) return response.tags;
  return [];
}

export const visibilityTagsApi = {
  async getVisibilityTags(): Promise<VisibilityTag[]> {
    const response = await protectedGet<VisibilityTagsResponse>(
      '/api/visibility-tags'
    );
    return normalizeTags(response);
  },
};
