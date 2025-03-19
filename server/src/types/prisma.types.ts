/**
 * Custom types for Prisma models and enums
 * These types should align with the Prisma schema
 * Using string literal types instead of enum objects to ensure exact string matching with API
 */

// User related types
export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT' | 'OBSERVER';

// Constants for UserRole to maintain type safety in code references
export const UserRoles = {
  ADMIN: 'ADMIN' as UserRole,
  STAFF: 'STAFF' as UserRole,
  CLIENT: 'CLIENT' as UserRole,
  OBSERVER: 'OBSERVER' as UserRole
};

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

// Constants for UserStatus
export const UserStatuses = {
  ACTIVE: 'ACTIVE' as UserStatus,
  INACTIVE: 'INACTIVE' as UserStatus,
  PENDING: 'PENDING' as UserStatus
};

// Token related types
export type TokenType = 'ACCESS' | 'REFRESH' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';

// Constants for TokenType
export const TokenTypes = {
  ACCESS: 'ACCESS' as TokenType,
  REFRESH: 'REFRESH' as TokenType,
  RESET_PASSWORD: 'RESET_PASSWORD' as TokenType,
  VERIFY_EMAIL: 'VERIFY_EMAIL' as TokenType
};

// Client related types
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

// Constants for ClientStatus
export const ClientStatuses = {
  ACTIVE: 'ACTIVE' as ClientStatus,
  INACTIVE: 'INACTIVE' as ClientStatus,
  PENDING: 'PENDING' as ClientStatus
};

// Service related types
export type ServiceStatus = 'ACTIVE' | 'INACTIVE';

// Constants for ServiceStatus
export const ServiceStatuses = {
  ACTIVE: 'ACTIVE' as ServiceStatus,
  INACTIVE: 'INACTIVE' as ServiceStatus
};

// State transfer related types
export type StateTransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Constants for StateTransferStatus
export const StateTransferStatuses = {
  PENDING: 'PENDING' as StateTransferStatus,
  APPROVED: 'APPROVED' as StateTransferStatus,
  REJECTED: 'REJECTED' as StateTransferStatus,
  COMPLETED: 'COMPLETED' as StateTransferStatus
};
