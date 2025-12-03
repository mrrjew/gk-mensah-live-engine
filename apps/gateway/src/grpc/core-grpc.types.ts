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
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface ThirdPartyRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  resetToken?: string;
  profilePicture?: string;
  resetTokenExpiry?: string;
  lockExpiry?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  metadata?: Record<string, any>;
  sessionId?: string;
  deviceInfo?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  twoFactorBackupCodes?: string[];
  passwordResetRequestedAt?: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: string;
  lastFailedLogin?: string;
  failedLoginAttempts?: number;
  lastPasswordReset?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: string;
  accountStatus?: string;
  securityQuestions?: Record<string, any>[];
  securityAnswers?: Record<string, any>[];
  lastSecurityQuestionChange?: string;
  lastSecurityAnswerChange?: string;
  passwordChangeRequired?: boolean;
  passwordChangeDeadline?: string;
  accountRecoveryEmail?: string;
  accountRecoveryPhone?: string;
  accountRecoveryToken?: string;
  accountRecoveryTokenExpiry?: string;
  accountRecoveryRequestedAt?: string;
  accountRecoveryStatus?: string;
  accountRecoveryMethod?: string;
  accountRecoveryVerified?: boolean;
  accountRecoveryVerificationToken?: string;
  accountRecoveryVerificationTokenExpiry?: string;
  accountRecoveryVerificationRequestedAt?: string;
  apiKey?: string;
}

export interface UsersList {
  items: User[];
}

export interface MeRequest {
  userId: string;
}

export interface UpdateUserRequest {
  id: string;
  user?: User;
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
  isArchived?: boolean;
  archivedAt?: string | null;
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
  isArchived?: boolean;
  archivedAt?: string | null;
}

export interface SubscriptionUpdateRequest extends SubscriptionCreateRequest {
  id: string;
  archivedAt?: string | null;
}

export interface AuthenticationGrpcService {
  ping(request: Empty): Observable<PingReply>;
  pingDatabase(request: Empty): Observable<PingReply>;
  createUser(request: AuthRequest): Observable<AuthResponse>;
  createAdminUser(request: AuthRequest): Observable<AuthResponse>;
  loginUser(request: LoginRequest): Observable<AuthResponse>;
  validateThirdParty(request: ThirdPartyRequest): Observable<AuthResponse>;
  me(request: MeRequest): Observable<User>;
}

export interface UsersGrpcService {
  pingMe(request: Empty): Observable<PingReply>;
  me(request: MeRequest): Observable<User>;
  findAll(request: Empty): Observable<UsersList>;
  findOne(request: IdRequest): Observable<User>;
  updateUser(request: UpdateUserRequest): Observable<User>;
  removeUser(request: IdRequest): Observable<User>;
  removeAllUsers(request: Empty): Observable<GenericResponse>;
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
