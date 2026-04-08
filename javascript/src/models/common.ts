export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more?: boolean;
}

export interface QuotaInfo {
  limit?: number;
  used?: number;
  remaining?: number;
}

export interface ClientOptions {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  customHeaders?: Record<string, string>;
}
