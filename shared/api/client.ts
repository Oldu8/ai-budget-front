import { env } from '@/shared/constants/env';

/** API error with status and optional parsed body for handling auth/validation errors. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type RequestOptions = RequestInit & {
  skipJsonParse?: boolean;
  /** Optional access token; when set, adds Authorization: Bearer. */
  accessToken?: string | null;
};

/**
 * General-purpose API request. Use for public calls or when passing a token explicitly.
 * For protected calls with automatic 401 refresh/retry, use the protected client (shared/api/protectedClient).
 */
async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipJsonParse, accessToken, headers, ...rest } = options;

  const authHeader: Record<string, string> = {};
  if (accessToken) {
    authHeader.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(headers ?? {}),
    },
    ...rest,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      (body?.message as string) || `Request failed with status ${response.status}`,
      response.status,
      body,
      response
    );
  }

  if (skipJsonParse) {
    return response as unknown as T;
  }
  return (await response.json()) as T;
}

export const api = {
  get<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(path, { method: 'GET', ...(options ?? {}) });
  },
  post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...(options ?? {}),
    });
  },
};
