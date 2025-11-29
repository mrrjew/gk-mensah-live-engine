export class CreatePaymentDto {
  amount: number;
  method: string;
  email: string;
  membershipId: string;
  userId: string;
  callbackUrl: string;
  reference?: string;
}
