export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

export interface PaginatedMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginatedMeta;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
