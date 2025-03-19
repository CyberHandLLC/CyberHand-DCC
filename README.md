# CyberHand Login Function

Full-stack authentication system implementation for the CyberHand platform, featuring a React frontend and Node.js backend with complete user authentication flow.

## Features

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
  - TailwindCSS for styling
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
   git clone https://github.com/yourusername/login-function.git
   cd login-function
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
