export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IdempotencyKey {
  key: string;
  response: any;
  createdAt: Date;
}
