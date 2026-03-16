import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import logger from './config/logger';
import { errorHandler } from './middleware/errorHandler.middleware';

import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import videoRoutes from './routes/video.routes';
import topicRoutes from './routes/topic.routes';
import tagRoutes from './routes/tag.routes';
import quizRoutes from './routes/quiz.routes';
import searchRoutes from './routes/search.routes';
import userRoutes from './routes/user.routes';
import youtubeRoutes from './routes/youtube.routes';
import roleRoutes from './routes/role.routes';
import progressRoutes from './routes/progress.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Railway
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por 15 min
  message: { message: 'Demasiados intentos de autenticación' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 solicitudes por cada 15 min IP general
  standardHeaders: true,
  legacyHeaders: false,
});

const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 creaciones por minuto
  message: { message: 'Demasiadas solicitudes de modificación, por favor inténtalo de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

app.use('/api/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method) && !req.path.startsWith('/auth')) {
    return createLimiter(req, res, next);
  }
  next();
});

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/progress', progressRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  const apiUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${PORT}`;
  logger.info(`🔗 API URL: ${apiUrl}`);
});

export default app;
