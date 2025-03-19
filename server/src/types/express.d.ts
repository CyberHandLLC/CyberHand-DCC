import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: User;
      role?: string;
    }
  }
}

// This file is a module
export {};
