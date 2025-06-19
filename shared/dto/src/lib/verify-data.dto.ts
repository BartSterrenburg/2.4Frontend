export class VerifyDataDto {
  userId?: number;
  data?: string;
  signature?: string;
  frameBytes?: Buffer; 
}
