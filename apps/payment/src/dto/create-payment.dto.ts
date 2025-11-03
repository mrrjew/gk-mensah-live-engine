export class CreatePaymentDto {
    amount: number;
    method: string;
    email: string
    membershipId: string;
    userId: string;
    paymentDate: Date;
    callback_url: string;
    reference?: string;
}