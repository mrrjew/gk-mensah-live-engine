import { Observable } from 'rxjs';

export type Empty = Record<string, never>;

export interface PingReply {
  message?: string;
}

export interface AuthRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
  phoneNumber?: string;
  adminKey?: string;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Record<string, any>;
}

export interface ThirdPartyRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface StructPayload<T = Record<string, any>> {
  data?: T;
}

export interface StructList<T = Record<string, any>> {
  items: T[];
}

export interface IdRequest {
  id: string;
}

export interface Membership {
  id?: string;
  userId?: string;
  subscriptionId?: string;
  startDate?: string;
  endDate?: string;
  paymentReference?: string;
  isActive?: boolean;
}

export interface MembershipList {
  items: Membership[];
}

export interface MembershipCreateRequest {
  userId: string;
  subscriptionId: string;
  paymentReference?: string;
  isActive?: boolean;
}

export interface MembershipUpdateRequest extends MembershipCreateRequest {
  id: string;
}

export interface MembershipOwnerRequest {
  userId: string;
}

export interface MembershipBySubscriptionRequest {
  subscriptionId: string;
}

export interface GenericResponse {
  success?: boolean;
  message?: string;
}

export interface SubscriptionDto {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  durationDays?: number;
  features?: string[];
  mostPopular?: boolean;
}

export interface SubscriptionList {
  items: SubscriptionDto[];
}

export interface SubscriptionCreateRequest extends Omit<SubscriptionDto, 'id'> {
  name: string;
  description: string;
  price: number;
  currency?: string;
  durationDays: number;
  features: string[];
  mostPopular?: boolean;
}

export interface SubscriptionUpdateRequest extends SubscriptionCreateRequest {
  id: string;
}

export interface AuthenticationGrpcService {
  ping(request: Empty): Observable<PingReply>;
  pingDatabase(request: Empty): Observable<PingReply>;
  createUser(request: AuthRequest): Observable<AuthResponse>;
  createAdminUser(request: AuthRequest): Observable<AuthResponse>;
  loginUser(request: LoginRequest): Observable<AuthResponse>;
  validateThirdParty(request: ThirdPartyRequest): Observable<AuthResponse>;
}

export interface UsersGrpcService {
  pingMe(request: Empty): Observable<PingReply>;
  me(request: StructPayload): Observable<StructPayload>;
  findAll(request: Empty): Observable<StructList>;
  findOne(request: IdRequest): Observable<StructPayload>;
  updateUser(request: StructPayload): Observable<StructPayload>;
  removeUser(request: IdRequest): Observable<StructPayload>;
  removeAllUsers(request: Empty): Observable<StructPayload>;
}

export interface MembershipsGrpcService {
  ping(request: Empty): Observable<PingReply>;
  create(request: MembershipCreateRequest): Observable<Membership>;
  findAll(request: Empty): Observable<MembershipList>;
  findOne(request: IdRequest): Observable<Membership>;
  findByUser(request: MembershipOwnerRequest): Observable<MembershipList>;
  findBySubscription(
    request: MembershipBySubscriptionRequest,
  ): Observable<MembershipList>;
  findActiveByUser(request: MembershipOwnerRequest): Observable<Membership>;
  update(request: MembershipUpdateRequest): Observable<Membership>;
  remove(request: IdRequest): Observable<GenericResponse>;
  deactivateExpired(request: Empty): Observable<GenericResponse>;
}

export interface SubscriptionsGrpcService {
  ping(request: Empty): Observable<PingReply>;
  create(request: SubscriptionCreateRequest): Observable<SubscriptionDto>;
  findAll(request: Empty): Observable<SubscriptionList>;
  findOne(request: IdRequest): Observable<SubscriptionDto>;
  update(request: SubscriptionUpdateRequest): Observable<GenericResponse>;
  remove(request: IdRequest): Observable<GenericResponse>;
}
