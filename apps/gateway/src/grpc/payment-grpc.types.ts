import { Observable } from 'rxjs';

export type Empty = Record<string, never>;

export interface PaymentMessage {
  message?: string;
}

export interface PaymentInitRequest {
  email: string;
  userId: string;
  membershipId: string;
  method: string;
  callbackUrl?: string;
  reference?: string;
}

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyRequest {
  reference: string;
}

export interface VerifyResponse {
  message: string;
}

export interface PaymentIdRequest {
  paymentId: string;
}

export interface UserPaymentsRequest {
  userId: string;
}

export interface PaymentModel {
  id?: string;
  userId?: string;
  email?: string;
  membershipId?: string;
  amount?: string;
  method?: string;
  status?: string;
  reference?: string;
  callbackUrl?: string;
  paymentDate?: string;
}

export interface PaymentsList {
  items: PaymentModel[];
}

export interface PaymentGrpcService {
  ping(request: Empty): Observable<PaymentMessage>;
  initializePayment(
    request: PaymentInitRequest,
  ): Observable<PaymentInitResponse>;
  verifyPayment(request: VerifyRequest): Observable<VerifyResponse>;
  getPayment(request: PaymentIdRequest): Observable<PaymentModel>;
  getPayments(request: Empty): Observable<PaymentsList>;
  getPaymentsByUser(request: UserPaymentsRequest): Observable<PaymentsList>;
}
