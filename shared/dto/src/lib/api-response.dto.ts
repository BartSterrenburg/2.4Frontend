// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
