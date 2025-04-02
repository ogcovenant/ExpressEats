export interface ResponseObject {
  success: boolean;
  message?: string;
  data?: unknown;
  errors?: unknown;
  accessToken?: string;
  refreshToken?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
