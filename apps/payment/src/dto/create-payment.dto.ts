export class CreatePaymentDto {
    amount: number;
    method: string;
    email: string
    membershipId: number;
    userId: number;
    paymentDate: string
    isValidUntil: string;
    recurring?: boolean;
    callback_url: string;
    reference?: string;
}