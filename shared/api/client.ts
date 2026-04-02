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
  const apiKeyHeader: Record<string, string> = {};
  if (env.apiSecret) {
    apiKeyHeader['X-API-Key'] = env.apiSecret;
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...apiKeyHeader,
      ...authHeader,
      ...(headers ?? {}),
    },
    ...rest,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => ({})) : await response.text().then(() => ({}));
    const message =
      (body?.message as string) ||
      (isJson ? `Request failed with status ${response.status}` : `Server returned ${response.status} (non-JSON). Check API URL and Accept header.`);
    throw new ApiError(message, response.status, body, response);
  }

  if (skipJsonParse) {
    return response as unknown as T;
  }
  if (!isJson) {
    const text = await response.text();
    throw new ApiError(
      `Expected JSON but got ${contentType?.slice(0, 50) ?? 'unknown'}. Response: ${text.slice(0, 100)}...`,
      response.status,
      undefined,
      response
    );
  }
  return (await response.json()) as T;
}

/**
 * DELETE: same auth/headers pattern as `request`. Supports 204 No Content and empty bodies.
 */
async function requestDelete(path: string, options: RequestOptions = {}): Promise<void> {
  const { accessToken, headers, ...rest } = options;

  const authHeader: Record<string, string> = {};
  if (accessToken) {
    authHeader.Authorization = `Bearer ${accessToken}`;
  }
  const apiKeyHeader: Record<string, string> = {};
  if (env.apiSecret) {
    apiKeyHeader['X-API-Key'] = env.apiSecret;
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...apiKeyHeader,
      ...authHeader,
      ...(headers ?? {}),
    },
    ...rest,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => ({})) : await response.text().then(() => ({}));
    const message =
      (body?.message as string) ||
      (isJson ? `Request failed with status ${response.status}` : `Server returned ${response.status} (non-JSON). Check API URL and Accept header.`);
    throw new ApiError(message, response.status, body, response);
  }

  if (response.status === 204 || response.status === 205) {
    return;
  }
  if (!isJson) {
    return;
  }
  const text = await response.text();
  if (!text.trim()) {
    return;
  }
}

/**
 * POST multipart (FormData). Does not set Content-Type; the runtime sets boundary.
 * Same JSON parsing and ApiError behavior as `request` for responses.
 */
async function parseResponseOrThrow<T>(
  response: Response,
  skipJsonParse?: boolean
): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => ({})) : await response.text().then(() => ({}));
    const message =
      (body?.message as string) ||
      (isJson ? `Request failed with status ${response.status}` : `Server returned ${response.status} (non-JSON). Check API URL and Accept header.`);
    throw new ApiError(message, response.status, body, response);
  }

  if (skipJsonParse) {
    return response as unknown as T;
  }
  if (!isJson) {
    const text = await response.text();
    throw new ApiError(
      `Expected JSON but got ${contentType?.slice(0, 50) ?? 'unknown'}. Response: ${text.slice(0, 100)}...`,
      response.status,
      undefined,
      response
    );
  }
  return (await response.json()) as T;
}

async function requestFormData<T = unknown>(
  path: string,
  body: FormData,
  options: RequestOptions = {}
): Promise<T> {
  const { skipJsonParse, accessToken, headers, ...rest } = options;

  const authHeader: Record<string, string> = {};
  if (accessToken) {
    authHeader.Authorization = `Bearer ${accessToken}`;
  }
  const apiKeyHeader: Record<string, string> = {};
  if (env.apiSecret) {
    apiKeyHeader['X-API-Key'] = env.apiSecret;
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...apiKeyHeader,
      ...authHeader,
      ...(headers ?? {}),
    },
    body,
    ...rest,
  });

  return parseResponseOrThrow<T>(response, skipJsonParse);
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
  put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...(options ?? {}),
    });
  },
  patch<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...(options ?? {}),
    });
  },
  postFormData<T = unknown>(
    path: string,
    body: FormData,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ) {
    return requestFormData<T>(path, body, { method: 'POST', ...(options ?? {}) });
  },
  delete(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return requestDelete(path, options ?? {});
  },
};
