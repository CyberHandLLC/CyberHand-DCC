# CyberHand Digital Client Console (DCC)

A comprehensive digital client management platform for CyberHand LLC, featuring role-based dashboards, client management, and a complete authentication system with a React frontend and Node.js backend.

## Features

- **Role-Based Dashboards**
  - Admin Dashboard with comprehensive management capabilities
  - Staff Dashboard focused on task and client management
  - Client Dashboard for service tracking and communication
  - Observer Dashboard with limited viewing capabilities

- **Client Management**
  - Client selection across relevant dashboard sections
  - Client-specific content management
  - Service tracking and management
  - Invoice management

- **User Authentication**
  - Registration with email and password
  - Login/Logout functionality
  - Token-based authentication with refresh tokens
  - Role-based access control (ADMIN, STAFF, CLIENT, OBSERVER)
  - Protected routes based on user roles

- **Security**
  - HTTP-only cookies for token storage
  - Password hashing with bcrypt
  - CSRF protection
  - Token refresh mechanism
  - Token revocation

- **Frontend**
  - React with TypeScript
  - React Router for navigation
  - Context API for state management
  - TailwindCSS for styling with dark/light mode
  - Responsive design for mobile and desktop
  - Axios for API requests

- **Backend**
  - Node.js with Express
  - TypeScript for type safety
  - Prisma ORM for database access
  - JWT for token generation
  - Error handling middleware
  - Request logging

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/CyberHandLLC/CyberHand-DCC.git
   cd CyberHand-DCC
   ```

2. Install dependencies:
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   ```
   # In server directory
   cp .env.example .env
   # Edit .env with your database and JWT settings
   ```

4. Run database migrations:
   ```
   cd server
   npx prisma migrate dev
   ```

5. Seed the database:
   ```
   cd server
   npx prisma db seed
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd client
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api

## Test Users

The database is seeded with the following test users:

- **Admin User**:
  - Email: admin@cyberhand.com
  - Password: Admin123!

- **Staff User**:
  - Email: staff@cyberhand.com
  - Password: Staff123!

- **Client User**:
  - Email: client@techcorp-example.com
  - Password: Client123!

## License

[MIT License](LICENSE)
