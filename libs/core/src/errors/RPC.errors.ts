export interface RpcError {
  statusCode: number;
  message: string;
  error: string;
  details?: any;
}
