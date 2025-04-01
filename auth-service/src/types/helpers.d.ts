export interface ResponseObject {
  message: string;
  success: boolean;
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
