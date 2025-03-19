# CyberHand API Endpoints Reference

This document provides a comprehensive reference of API endpoints required for the CyberHand website implementation. It serves as a guide for both frontend and backend developers to ensure consistent integration.

## API Integration Guidelines

### Frontend Implementation

When implementing frontend API integration, follow these guidelines:

1. **Always use `useRealApi` hook** (not the deprecated `useApi`)
   ```typescript
   const api = useRealApi('serviceModel');
   ```

2. **Define proper model interfaces** with clear contracts:
   ```typescript
   interface ServiceModel {
     getAll(): Promise<ApiResponse<Service[]>>;
     getById(id: string): Promise<ApiResponse<Service>>;
     // Other methods...
   }
   ```

3. **Follow proper component implementation pattern**:
   ```typescript
   const fetchServices = useCallback(async () => {
     setLoading(true);
     try {
       const result = await api.executeApiCall<ApiResponse<Service[]>>('getAll');
       if (result.success) {
         setServices(result.data);
       } else {
         setError(result.error || 'Failed to fetch services');
       }
     } catch (err) {
       setError('An unexpected error occurred');
     } finally {
       setLoading(false);
     }
   }, [api]);

   useEffect(() => {
     fetchServices();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   ```

4. **Error Handling**: Implement proper error handling with loading states and error messages

5. **Authentication**: Use HttpOnly cookies for authentication (JWT tokens)

### Backend Implementation

1. **Follow RESTful conventions** for endpoint design
2. **Implement proper validation** for all request parameters
3. **Return consistent response formats** across all endpoints
4. **Use proper HTTP status codes** for different response types
5. **Implement HttpOnly cookie-based authentication** for security

## Response Format Standard

All API responses should follow this standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    // Other metadata as needed
  };
}
```

## Authentication Endpoints 

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/auth/register` | POST | Register a new user | `{ email, password, name, role }` | `{ success, data: { user } }` |
| `/api/auth/login` | POST | User login | `{ email, password }` | `{ success, data: { user } }` + HttpOnly cookies (access token + refresh token) |
| `/api/auth/logout` | POST | User logout | None | `{ success }` + Clear all auth cookies |
| `/api/auth/refresh` | POST | Refresh access token | None (uses refresh token cookie) | `{ success }` + New HttpOnly access token cookie (refresh token remains unchanged) |
| `/api/auth/me` | GET | Get current user info | None | `{ success, data: { user } }` |
| `/api/auth/revoke` | POST | Revoke specific tokens | `{ tokenIds?: string[], all?: boolean, exceptCurrent?: boolean }` | `{ success, data: { revokedCount: number } }` |
| `/api/auth/forgot-password` | POST | Initiate password reset | `{ email }` | `{ success }` |
| `/api/auth/reset-password` | POST | Complete password reset | `{ token, password }` | `{ success }` |
| `/api/auth/verify-email` | POST | Email verification | `{ token }` | `{ success }` |

### Authentication Token Details

- **Access Token**: JWT with 24-hour lifetime stored as HttpOnly cookie
- **Refresh Token**: Long-lived JWT (14 days) stored as HttpOnly, Secure, SameSite=Strict cookie
- **Token Storage**: Both tokens stored server-side in secure token registry with user mapping
- **Token Rotation**: 
  - Refresh tokens are strictly one-time use
  - When a refresh token is used, it is immediately marked as "used" in the token registry
  - A new refresh token and access token pair is issued with each successful refresh
  - Previous refresh token is invalidated after a 5-minute grace period to handle concurrent requests
  - Suspicious activity (multiple concurrent refresh attempts) triggers forced re-authentication
- **Token Versioning**:
  - Each token contains a version identifier tied to the user's security version
  - User security version increments on password change, role change, or forced security reset
  - Tokens with outdated security versions are automatically rejected
- **Revocation**:
  - Individual tokens can be revoked via the `/api/auth/revoke` endpoint
  - All user tokens can be invalidated on password change or security concern
  - Administrators can force revocation of all tokens for specific users

## Service Catalog Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/services` | GET | Get all service categories | Query: `{ includeServices?: boolean, includeTiers?: boolean, includePackages?: boolean, tier?: string, hasAI?: boolean, priceMax?: number, category?: string, sortBy?: 'name'|'price'|'popular', sortDir?: 'asc'|'desc', search?: string, page?: number, limit?: number }` | `{ success, data: { categories }, meta: { pagination } }` |
| `/api/services/:categoryId` | GET | Get services by category | Path: `categoryId`, Query: `{ includeTiers?: boolean, tier?: string, priceMax?: number, sortBy?: 'name'|'price'|'popular', sortDir?: 'asc'|'desc', search?: string, page?: number, limit?: number }` | `{ success, data: { services }, meta: { pagination } }` |
| `/api/services/:categoryId/:id` | GET | Get specific service details | Path: `categoryId`, `id` | `{ success, data: { service } }` |
| `/api/services/search` | POST | Advanced service search | `{ filters: { categories?: string[], tiers?: string[], priceRange?: [min, max], hasAI?: boolean, features?: string[] }, pagination: { page, limit }, sort: { field, direction } }` | `{ success, data: { services }, meta: { pagination } }` |
| `/api/services/bulk` | POST | Get multiple services by IDs | `{ ids: string[] }` | `{ success, data: { services } }` |
| `/api/services/features` | GET | Get services by feature | Query: `{ feature: string, page?: number, limit?: number }` | `{ success, data: { services }, meta: { pagination } }` |
| `/api/tiers` | GET | Get all service tiers | Query: `{ serviceId?: string, name?: string, sortBy?: 'name'|'price', sortDir?: 'asc'|'desc', page?: number, limit?: number }` | `{ success, data: { tiers }, meta: { pagination } }` |
| `/api/tiers/:serviceId` | GET | Get tiers for specific service | Path: `serviceId` | `{ success, data: { tiers } }` |
| `/api/tiers/bulk` | POST | Get multiple tiers by IDs | `{ ids: string[] }` | `{ success, data: { tiers } }` |
| `/api/packages` | GET | Get all service packages | Query: `{ includeServices?: boolean, tier?: string, hasAI?: boolean, priceMax?: number, sortBy?: 'name'|'price'|'popular', sortDir?: 'asc'|'desc', page?: number, limit?: number }` | `{ success, data: { packages }, meta: { pagination } }` |
| `/api/packages/:id` | GET | Get specific package details | Path: `id` | `{ success, data: { package } }` |
| `/api/packages/bulk` | POST | Get multiple packages by IDs | `{ ids: string[] }` | `{ success, data: { packages } }` |

## Client Management Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/clients` | GET | Admin: Get all clients | Query: `{ page, limit, search, industry, hasActiveServices, sortBy?: 'name'|'created'|'serviceCount', sortDir?: 'asc'|'desc' }` | `{ success, data: { clients }, meta: { pagination } }` |
| `/api/clients/:id` | GET | Get specific client details | Path: `id` | `{ success, data: { client } }` |
| `/api/clients` | POST | Create new client | `{ companyName, industry, websiteUrl, /* other fields */ }` | `{ success, data: { client } }` |
| `/api/clients/:id` | PUT | Full update of client information | `{ companyName, industry, /* all required fields */ }` | `{ success, data: { client } }` |
| `/api/clients/:id` | PATCH | Partial update of client information | `{ companyName?, industry?, /* any optional fields */ }` | `{ success, data: { client } }` |
| `/api/clients/:id` | DELETE | Delete a client | Path: `id`, Query: `{ force?: boolean }` | `{ success }` |
| `/api/clients/:id/services` | GET | Get services for specific client | Path: `id`, Query: `{ status?: 'active'|'pending'|'expired'|'all', sortBy?: 'name'|'startDate'|'status', sortDir?: 'asc'|'desc', page?: number, limit?: number }` | `{ success, data: { services }, meta: { pagination } }` |
| `/api/clients/:id/services` | POST | Add service to client | Path: `id`, Body: `{ serviceId, tierId, startDate, status }` | `{ success, data: { clientService } }` |
| `/api/clients/:id/services/:serviceId` | PUT | Full update of client service | Path: `id`, `serviceId`, Body: `{ tierId, startDate, endDate, status, notes }` | `{ success, data: { clientService } }` |
| `/api/clients/:id/services/:serviceId` | PATCH | Partial update of client service | Path: `id`, `serviceId`, Body: `{ tierId?, startDate?, endDate?, status?, notes? }` | `{ success, data: { clientService } }` |
| `/api/clients/:id/services/:serviceId` | DELETE | Remove service from client | Path: `id`, `serviceId`, Query: `{ keepRecords?: boolean }` | `{ success }` |
| `/api/clients/:id/services/:serviceId/activate` | POST | Activate a client service | Path: `id`, `serviceId`, Body: `{ activationDate?: string, notifyClient?: boolean, sendWelcomePackage?: boolean }` | `{ success, data: { clientService } }` |
| `/api/clients/:id/services/:serviceId/deactivate` | POST | Deactivate a client service | Path: `id`, `serviceId`, Body: `{ reason: 'contract_ended'|'client_request'|'payment_issue'|'service_discontinued'|'other', reasonDetails?: string, effectiveDate?: string, notifyClient?: boolean }` | `{ success, data: { clientService } }` |

## Content & Resource Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/blog` | GET | Get blog posts | Query: `{ page, limit, category }` | `{ success, data: { posts }, meta: { pagination } }` |
| `/api/blog/:id` | GET | Get specific blog post | Path: `id` | `{ success, data: { post } }` |
| `/api/case-studies` | GET | Get case studies | Query: `{ page, limit, industry }` | `{ success, data: { caseStudies }, meta: { pagination } }` |
| `/api/case-studies/:id` | GET | Get specific case study | Path: `id` | `{ success, data: { caseStudy } }` |
| `/api/resources` | GET | Get resource documents | Query: `{ page, limit, type }` | `{ success, data: { resources }, meta: { pagination } }` |
| `/api/resources/:id` | GET | Get specific resource | Path: `id` | `{ success, data: { resource } }` |

## Contact & Lead Management Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/contact` | POST | Submit contact form | `{ name, email, message, /* other fields */ }` | `{ success }` |
| `/api/contact/service-inquiry` | POST | Submit service-specific inquiry | `{ name, email, serviceId, tierId, details }` | `{ success }` |

## Logging & Monitoring Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/logs` | POST | Send frontend logs to backend | `{ logs: Array<{ level: LogLevel, message: string, context: LogContext, timestamp: string }> }` | `{ success, data: { processedCount: number } }` |
| `/api/logs/flush` | POST | Force immediate processing of buffered logs | None | `{ success }` |

### Log Levels

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
```

### Log Context Structure

Logs should use the following standardized context structure:

```typescript
interface LogContext {
  // User context
  userId?: string;
  userRole?: string;
  clientId?: string;
  
  // Request context
  requestId?: string;
  url?: string;
  component?: string;
  
  // Error context
  errorCode?: string;
  errorStack?: string;
  
  // Operation context
  operation?: string;
  operationStatus?: string;
  duration?: number;
  
  // Custom context (varies by feature area)
  serviceId?: string;
  tierId?: string;
  packageId?: string;
  
  // Additional fields as needed with descriptive names
  [key: string]: any;
}
```

## State Transfer Support Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/state-transfer/store` | POST | Store state on server | `{ data, expiresIn, purpose }` | `{ success, data: { id, expiresAt } }` |
| `/api/state-transfer/:id` | GET | Retrieve stored state | Path: `id` | `{ success, data: { state, metadata: { purpose, createdAt, expiresAt } } }` |
| `/api/state-transfer/:id` | PATCH | Update stored state | Path: `id`, Body: `{ data?, expiresIn?, purpose? }` | `{ success, data: { id, expiresAt } }` |
| `/api/state-transfer/:id` | DELETE | Delete stored state | Path: `id` | `{ success }` |
| `/api/state-transfer/cleanup` | POST | Admin: Force cleanup of expired state | Query: `{ olderThan?: string, purpose?: string }` | `{ success, data: { cleanedCount: number } }` |

### State Transfer Purpose

The `purpose` field uses a TypeScript union type to indicate the intended use of the stored state:

```typescript
/**
 * Defines the purpose of stored state with strong typing
 */
type StateTransferPurpose =
  // Standard system purposes
  | 'auth_flow'           // Authentication process state
  | 'onboarding'          // User onboarding process
  | 'form_recovery'       // Multi-step form data recovery
  | 'service_selection'   // Service selection wizard state
  | 'checkout'            // Checkout process state
  | 'preference'          // User preference state
  | 'ui_state'            // UI state (expanded sections, etc.)
  // Custom purposes with namespace pattern
  | `custom:${string}:${string}`;
```

Custom purposes follow the format `custom:namespace:description` where:
- `namespace` identifies the feature area or team (e.g., 'marketing', 'admin', 'dashboard')
- `description` provides a brief identifier for the specific purpose (e.g., 'campaign-builder', 'report-filter')

Example custom purposes:
- `custom:marketing:campaign-builder`
- `custom:admin:user-filter-preferences`
- `custom:dashboard:widget-layout`

### State Transfer Security

State transfer endpoints implement the following security measures:

1. **Authentication**: 
   - Unauthenticated users can only store non-sensitive, public data with strict rate limiting
   - Authenticated users have higher limits and can store user-specific data
   - Only the creator of a state object can retrieve, update, or delete it (user ID verification)

2. **Expiration Enforcement**:
   - All state objects have a mandatory expiration (default: 30 minutes, max: 24 hours)
   - Expired state is automatically purged through a scheduled job
   - API returns 404 for expired state IDs
   - The PATCH endpoint can extend expiration time within allowed limits

3. **Data Validation**:
   - Size limits on stored data (max 10KB for unauthenticated, 50KB for authenticated)
   - Content validation to prevent storage of sensitive data (PII filtering)
   - Purpose field required to track usage patterns and apply appropriate policies
   - For PATCH operations, partial updates are merged with existing data

4. **Rate Limiting**:
   - Unauthenticated: 10 requests per hour per IP
   - Authenticated: 50 requests per hour per user
   - PATCH operations count toward the same limit as POST operations

5. **Deletion Policy**:
   - Users can manually delete their state objects via DELETE endpoint
   - All state objects are automatically deleted after expiration
   - Admin cleanup endpoint available for compliance/privacy requirements
   - Audit logs maintained for all state operations
   - PATCH operations preserve audit trail (don't create new entries)

## Models and Interfaces

### Service Model

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  features: string[];
  tiers: ServiceTier[];
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  services?: Service[];
}

interface ServiceTier {
  id: string;
  name: string;         // Starter, Pro, Business, Enterprise
  description: string;
  priceOneTime: number; // One-time setup fee
  priceRecurring: number; // Monthly recurring cost
  features: string[];
  serviceId: string;
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  priceRecurring: number;
  services: {
    serviceId: string;
    tierId: string;
  }[];
  features: string[];
}
```

### Client Model

```typescript
interface Client {
  id: string;
  companyName: string;
  industry?: string;
  websiteUrl?: string;
  serviceStartDate?: string; // ISO date string
  serviceEndDate?: string;   // ISO date string
  notes?: string;
  createdAt: string;         // ISO date string
  updatedAt: string;         // ISO date string
  users?: User[];
}

interface ClientService {
  id: string;
  clientId: string;
  serviceId: string;
  tierId: string;
  startDate: string;         // ISO date string
  endDate?: string;          // ISO date string
  status: 'active' | 'pending' | 'expired';
  notes?: string;
  activationDate?: string;   // ISO date string
  lastStatusChange: {
    status: string;
    date: string;
    reason?: string;
  };
}
```

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT' | 'OBSERVER';
  clientId?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```
## Authentication Flow

1. **Registration**:
   - POST to `/api/auth/register`
   - Server creates user and sends verification email
   - User verifies email with `/api/auth/verify-email`

2. **Login**:
   - POST credentials to `/api/auth/login`
   - Server validates and sets HttpOnly cookie with JWT
   - Returns user info (not the token)

3. **Authenticated Requests**:
   - All requests include HttpOnly cookie automatically
   - Server validates token on protected routes

4. **Token Refresh**:
   - When token nears expiration, call `/api/auth/refresh`
   - Server issues new token if refresh token is valid
   - Frontend stores nothing, just uses cookies

5. **Logout**:
   - POST to `/api/auth/logout`
   - Server invalidates token and clears cookie

## Implementation Considerations
## Prisma Database Integration

The CyberHand API is built on top of Prisma ORM for type-safe database operations. This section outlines how the API endpoints map to Prisma models and operations.

### Prisma Schema Mapping

Each endpoint manipulates data through corresponding Prisma model operations:

```typescript
// Sample Prisma schema (prisma/schema.prisma)
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  name        String
  role        String    @default("user")
  password    String
  securityVersion Int    @default(1)    // Incremented on password changes and security events
  verified    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tokens      Token[]
  clientUsers ClientUser[]
}

model Token {
  id          String    @id @default(uuid())
  userId      String
  type        String    // "access" or "refresh" 
  token       String    @unique
  used        Boolean   @default(false) // For refresh tokens
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Service {
  id          String    @id @default(uuid())
  name        String
  description String
  categoryId  String
  features    Json      // Array of feature strings
  price       Decimal
  tiers       ServiceTier[]
  category    Category  @relation(fields: [categoryId], references: [id])
  clientServices ClientService[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// Other models: Category, ServiceTier, Package, Client, ClientService, StateTransfer, Log
```

### Controller-Prisma Integration Examples

```typescript
// Sample controller with Prisma integration (src/controllers/services.controller.ts)
export class ServicesController {
  async getAll(
    req: Request<{}, {}, {}, GetAllServicesQuery>,
    res: Response
  ): Promise<void> {
    const { page = 1, limit = 10, category, tier, hasAI, priceMax, sortBy, sortDir, search } = req.query;
    
    // Build Prisma query filters
    const where = {
      ...(category ? { categoryId: category } : {}),
      ...(hasAI ? { features: { has: 'ai_powered' } } : {}),
      ...(priceMax ? { price: { lte: parseFloat(priceMax) } } : {}),
      ...(search ? { 
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ] 
      } : {})
    };

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const orderBy = sortBy 
      ? { [sortBy]: sortDir === 'desc' ? 'desc' : 'asc' }
      : { createdAt: 'desc' };
      
    try {
      // Use Prisma client for database operations
      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where,
          include: {
            category: true,
            ...(req.query.includeTiers ? { tiers: true } : {})
          },
          orderBy,
          skip,
          take: limit
        }),
        prisma.service.count({ where })
      ]);
      
      // Return API response
      res.json({
        success: true,
        data: { services },
        meta: {
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch services' 
      });
    }
  }
  
  // Other controller methods...
}
```

### Prisma Migrations and Deployment

The API implementation uses Prisma migrations for database schema management:

1. **Generate Migrations**:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

2. **Apply Migrations in Production**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Seeding Initial Data**:
   ```bash
   npx prisma db seed
   ```

## Swagger OpenAPI Integration

The CyberHand API is fully documented using Swagger OpenAPI specifications. This allows for interactive API documentation and testing.

### OpenAPI Specification

The API endpoints are documented using OpenAPI 3.0 specification:

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: CyberHand API
  version: 1.0.0
  description: API endpoints for the CyberHand platform
servers:
  - url: /api
    description: API base path
tags:
  - name: Authentication
    description: Authentication related operations
  - name: Services
    description: Service catalog operations
  - name: Clients
    description: Client management operations
  - name: State Transfer
    description: State transfer operations
  - name: Logs
    description: Logging operations

paths:
  /auth/login:
    post:
      tags:
        - Authentication
      summary: User login
      description: Authenticate a user and receive JWT tokens
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
              required:
                - email
                - password
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: object
                    properties:
                      user:
                        $ref: '#/components/schemas/User'
          headers:
            Set-Cookie:
              description: HttpOnly cookies for auth tokens
              schema:
                type: string
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  
  # Other endpoints...

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        role:
          type: string
          enum: [user, admin, client_admin]
        # Other properties...
    
    Service:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        description:
          type: string
        price:
          type: number
          format: decimal
        features:
          type: array
          items:
            type: string
        # Other properties...
    
    # Other schemas...
    
    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
  
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: access_token
```

### Swagger UI Integration

The API documentation is served through a Swagger UI interface at `/api-docs`:

```typescript
// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CyberHand API',
      version: '1.0.0',
      description: 'API endpoints for the CyberHand platform'
    },
    servers: [
      {
        url: '/api',
        description: 'API base path'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CyberHand API Documentation'
  }));
}
```

### Controller Annotations for Swagger

API endpoints are documented using JSDoc annotations:

```typescript
/**
 * @swagger
 * /services/{categoryId}/{id}:
 *   get:
 *     summary: Get specific service details
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     service:
 *                       $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async getServiceById(req, res) {
  // Implementation...
}
```

### Frontend Integration with Generated API Client

The OpenAPI specification is used to generate a type-safe API client for frontend integration:

```typescript
// Using openapi-typescript-codegen for client generation
// npm run generate-api-client

// src/api/client.ts
import { Configuration, DefaultApi } from './generated';
import { getAccessToken } from '../utils/auth';

const config = new Configuration({
  basePath: '/api',
  middleware: [{
    pre: async (context) => {
      // Automatically handle authentication
      const token = getAccessToken();
      if (token) {
        context.init.headers = {
          ...context.init.headers,
          'Authorization': `Bearer ${token}`
        };
      }
      return context;
    },
    post: async (context) => {
      // Handle token refresh on 401 errors
      if (context.response?.status === 401) {
        // Attempt token refresh logic
      }
      return context;
    }
  }]
});

export const apiClient = new DefaultApi(config);
```

### API Testing with Swagger

The Swagger UI provides a testing interface for API endpoints:

1. Navigate to `/api-docs`
2. Authenticate using the `/auth/login` endpoint
3. Test other endpoints with the authenticated session
4. Validate response formats and status codes

This interactive documentation ensures that all API endpoints are properly documented and testable, facilitating frontend-backend integration and development.

## API Implementation Best Practices

1. **API Error Handling**
   - Use appropriate HTTP status codes (400, 401, 403, 404, 500)
   - Provide detailed error messages in development, generic in production
   - Log errors with context for debugging

2. **Rate Limiting**
   - Implement rate limiting on authentication endpoints
   - Consider rate limiting on public endpoints to prevent abuse

3. **CORS Configuration**
   - Configure CORS to allow only verified origins
   - Ensure credentials are allowed for cookie-based auth

4. **Validation**
   - Implement thorough input validation on all endpoints
   - Use a validation library like Joi, Zod, or express-validator

5. **Documentation**
   - Maintain this document as the source of truth
   - Update as endpoints and schemas evolve
