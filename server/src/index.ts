import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Routes
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import clientRoutes from './routes/client.routes';
import stateTransferRoutes from './routes/stateTransfer.routes';
import logRoutes from './routes/log.routes';
import contentRoutes from './routes/content.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Initialize environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CyberHand API',
      version: '1.0.0',
      description: 'API documentation for the CyberHand platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://cyber-hand.com' 
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/state-transfer', stateTransferRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/content', contentRoutes);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Don't crash the server, but log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Gracefully shut down
  process.exit(1);
});
